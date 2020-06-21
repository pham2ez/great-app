const express = require('express');
const users = require('../models/users');
const Utils = require('../models/Utils');
const Address = require('../models/Address');

const router = express.Router();

/* Change the current user's address. */
router.put('/address', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: "You need to be logged in to change your login information!"
    }).end();
    return;
  }
  var user = users.getUserById(req.session.userid);
  // var encodedStreet = Utils.encodeString(req.body.streetAddr);
  // var encodedCity = Utils.encodeString(req.body.city);
  // var encodedState = Utils.encodeString(req.body.state);
  // user.setAddress(Address(encodedStreet, encodedCity, encodedState));
  user.setAddress(Address(req.body.streetAddr, req.body.city, req.body.state));
  res.end("Address set successfully!");
});

/* Change the current user's email. */
router.put('/email', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: "You need to be logged in to change your login information!"
    }).end();
    return;
  }
  var response = "";
  var user = users.getUserById(req.session.userid);
  if (user !== undefined) {
    if (users.getUserByEmail(req.body.email) !== undefined) {
      res.status(403).json({
        error: "The email " + req.body.email + " is already associated with an account."
      }).end();
      return;
    }
    user.setEmailAddress(req.body.email);
    res.end("Email address changed to " + req.body.email + " successfully!");
  } else {
    res.status(404).json({
      error: "No such user could be found!"
    }).end();
  }
});

/* Change the current user's name. */
router.put('/name', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: "You need to be logged in to change your login information!"
    }).end();
    return;
  }
  var response = "";
  var user = users.getUserById(req.session.userid);
  if (req.body.firstName !== undefined) {
    var encodedFirst = Utils.encodeString(req.body.firstName);
    user.setFirstName(encodedFirst);
    response += "First name changed to " + encodedFirst + " successfully!";
  }
  if (req.body.lastName !== undefined) {
    var encodedLast = Utils.encodeString(req.body.lastName);
    user.setLastName(encodedLast);
    response += "Last name changed to " + encodedLast + " successfully!";
  }
  if (response === "") {
    res.status(400).json({
      error: "Your request contained no information!"
    }).end();
  } else {
    res.end(response);
  }
});

/* Change the current user's email. */
router.put('/password', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: "You need to be logged in to change your login information!"
    }).end();
    return;
  }
  var user = users.getUserById(req.session.userid);
  if (user !== undefined) {
    user.setPasswordHash(req.body.passwordHash);
    res.end("Password changed successfully!");
  } else {
    res.status(404).json({
      error: "No such user could be found!"
    }).end();
  }
});

/* Change the current user's zip code. */
router.put('/zip', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: "You need to be logged in to change your login information!"
    }).end();
    return;
  }
  var response = "";
  var user = users.getUserById(req.session.userid);
  var zip = req.body.zipCode;
  if (Utils.isZipCode(zip)) {
    user.setZipCode(zip);
    res.end("Zip code set to " + req.body.zipCode + " successfully!");
  } else {
    res.status(400).json({
      error: "The string " + zip + " is not a valid 5-digit zip code!"
    }).end();
  }
});

/* Delete the current user. */
router.delete('/delete', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: "You need to be logged in to delete your account!"
    }).end();
  } else {
    users.deleteUser(req.session.userid);
    req.session.userid = undefined;
    res.end("Your account has been deleted.");
  }
});

/* Gets the current user's email address and name. */
router.get('/me', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: "You're not logged in!"
    }).end();
  } else {
    var user = users.getUserById(req.session.userid);
    if (user !== undefined) {
      res.end(JSON.stringify({
        email: user.getEmailAddress(),
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        zipCode: user.getZipCode(),
        address: user.getAddress(),
      }));
    } else {
      res.status(404).json({
        error: "No such user could be found!"
      }).end();
    }
  }
});

/* Log out the current user. */
router.delete('/logout', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: "You aren't logged in!"
    }).end();
  } else {
    req.session.userid = undefined;
    res.end("You have been logged out.");
  }
});

module.exports = router;
