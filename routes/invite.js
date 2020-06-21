const express = require('express');
const Greatings = require('../models/Greatings');
const users = require('../models/users');

const router = express.Router();

/**
 * Accept the invitation for the grEATing whose ID hash is grIdHash
 * :grIdHash - ID hash of the grEATing
 * @return {string} - success message
 * @throws {403} - if user is not logged in
 * @throws {404} - if user or grEATing doesn't exist
 */
router.post('/:grIdHash/accept', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: 'You must be logged in to join a grEATing!'
    }).end();
    return;
  } else {
    var user = users.getUserById(req.session.userid);
    if (user === undefined) {
      res.status(404).json({
        error: 'No such user exists!'
      }).end();
      return;
    }
  }
  var greating = Greatings.findGreatingWithHash(req.params.grIdHash);
  if (greating === undefined) {
    res.status(404).json({
      error: 'This grEATing could not be found!'
    }).end();
  } else {
    Greatings.addMember(greating.id, user);
    res.end('You successfully accepted the invite for this grEATing!');
  }
});

/**
 * Decline the invitation for the grEATing whose ID hash is grIdHash
 * :grIdHash - ID hash of the grEATing
 * @return {string} - success message
 * @throws {403} - if user is not logged in
 * @throws {404} - if user or grEATing doesn't exist
 */
router.post('/:grIdHash/decline', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: 'You must be logged in to join a grEATing!'
    }).end();
    return;
  } else {
    var user = users.getUserById(req.session.userid);
    if (user === undefined) {
      res.status(404).json({
        error: 'No such user exists!'
      }).end();
      return;
    }
  }
  var greating = Greatings.findGreatingWithHash(req.params.grIdHash);
  if (greating === undefined) {
    res.status(404).json({
      error: 'This grEATing could not be found!'
    }).end();
  } else {
    Greatings.declineInvite(greating.id, user);
    res.end('You successfully declined the invite for this grEATing!');
  }
});

/**
 * Send an invitation to the grEATing whose ID is grId
 * :grId - id of the grEATing
 * @param email - email of the invited member
 * @return {string} - success message
 * @throws {403} - if user is not logged in, or if user is not part of the grEATing
 * @throws {404} - if user doesn't exist
 */
router.post('/:grId/send', (req, res) => {
  if (req.session.userid === undefined) {
    res.status(403).json({
      error: 'You must be logged in to invite someone to a grEATing!'
    }).end();
    return;
  } else {
    var user = users.getUserById(req.session.userid);
    if (user === undefined) {
      res.status(404).json({
        error: 'No such user exists!'
      }).end();
      return;
    } else if (!(Greatings.isMember(user, req.params.grId) || Greatings.isOrganizer(user, req.params.grId))) {
        res.status(403).json({
          error: "You can't invite members to a grEATing you're not a part of!"
        }).end();
        return;
    }
  }
  let greating = Greatings.findGreating(req.params.grId);
  Greatings.inviteMember(req.params.grId, req.body.email);
  console.log("Updated greating invites: " + greating.invites);
  res.end('You successfully sent an invite for this grEATing!');
});

module.exports = router;
