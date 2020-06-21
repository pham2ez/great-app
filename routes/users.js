const express = require('express');
const users = require('../models/users');
const Utils = require('../models/Utils');
const Greatings = require('../models/Greatings');

const router = express.Router();

/* Make a new user. */
router.post('/:email', (req, res) => {
  var email = decodeURIComponent(req.params.email).toLowerCase();
  if (!Utils.isEmailAddress(email)) {
    res.status(400).json({
      error: "The string " + email + " is not a valid email address."
    }).end();
    return;
  }
  if (!Utils.isZipCode(req.body.zipCode)) {
    res.status(400).json({
      error: "The string " + req.body.zipCode + " is not a valid 5-digit zip code."
    }).end();
    return;
  }
  var success = users.newUser(Utils.encodeString(req.body.firstName), Utils.encodeString(req.body.lastName), email, req.body.passwordHash, req.body.zipCode);
  if (success) {
    res.send("User with email " + email + " created successfully!");
  } else {
    res.status(400).json({
      error: "The email " + email + " is already associated with an account."
    }).end();
  }
});

/* Log in a user. */
router.post('/:email/login', (req, res) => {
  var email = decodeURIComponent(req.params.email).toLowerCase();
  var id = users.getIdByEmail(email);
  var user = users.getUserById(id);
  if (id === undefined) {
    res.status(400).json({
      error: "No such user exists!"
    }).end();
  } else if (user.authenticate(req.body.passwordHash)) {
    req.session.userid = id;
    res.send("User with email " + email + " logged in successfully!");
  } else {
    res.status(400).json({
      error: "Wrong password!"
    }).end();
  }
});

/* GET a user's grEATings. */
router.get('/:email/greatings', (req, res) => {
  var email = decodeURIComponent(req.params.email).toLowerCase();
  var id = users.getIdByEmail(email);
  var user = users.getUserById(id);
  if (user === undefined) {
    res.status(404).json({
      error: "No such user exists!"
    }).end();
  } else {
    res.end(JSON.stringify({accepted: Greatings.findGreatingsWithMember(email),
                            invited: Greatings.findGreatingsWithInvitedMember(email)}));
  }
});

	/* GET a user's zip code. */
  router.get('/:email/zip', (req, res) => {
    var email = decodeURIComponent(req.params.email).toLowerCase();
    var id = users.getIdByEmail(email);
    var user = users.getUserById(id);
    if (user === undefined) {
      res.status(400).json({
        error: "No such user exists!"
      }).end();
    } else {
      res.end(JSON.stringify({zip: user.getZipCode()}));
    }
  });
  
/* GET a user's dietary restrictions. */
router.get('/:email/restrictions', (req, res) => {
  var email = decodeURIComponent(req.params.email).toLowerCase();
  var id = users.getIdByEmail(email);
  var user = users.getUserById(id);
  if (user === undefined) {
    res.status(404).json({
      error: "No such user exists!"
    }).end();
  } else {
    res.end(JSON.stringify({restrictions: user.getRestrictions()}));
  }
});

/* PUT a user's dietary restrictions. */
router.put('/:email/restrictions', (req, res) => {
  var email = decodeURIComponent(req.params.email).toLowerCase();
  var id = users.getIdByEmail(email);
  var user = users.getUserById(id);
  if (user === undefined) {
    res.status(404).json({
      error: "No such user exists!"
    }).end();
  } else {
    user.setRestrictions([...req.body.restrictions]);
    res.end('Your dietary restrictions have been set to ' + req.body.restrictions + ' successfully!')
  }
});

module.exports = router;
