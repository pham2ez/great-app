const express = require('express');

const Greatings = require('../models/Greatings');
const Availability = require('../models/Availability');
const users = require('../models/users');

const router = express.Router();

/**
 * Create a grEATing
 * @name POST/api/greatings
 * @return
 */
router.post('/', (req, res) => {
    if (req.session.username !== undefined) {
      signin(res);
    } else {
      let user = users.getUserByEmail(req.body.email);
      let grID = Greatings.createGreating(req.body.title, user);
      Availability.createAvailability(req.body.dates,req.body.times,req.body.length,grID);
      res.status(200).json(
          grID
      ).end();
    }
});

/**
 * Get the list of restaurants currently associated with each great user is a part of.
 * @name GET/api/greatings/restaurants/:email
 * @return
 */
router.get('/restaurants/:email', (req, res) => {
  var email = decodeURIComponent(req.params.email).toLowerCase();
  var id = users.getIdByEmail(email);
  var user = users.getUserById(id);
  if (user === undefined) {
    res.status(400).json({
      error: "No such user exists!"
    }).end();
  } else {
    let accepted = Greatings.findGreatingsWithMember(email);
    let out = {};
    for(let great of accepted){
      out[great.id] = [great.title, great.restaurants.map(function(val, index){ return val.place_id;})];
    }
    res.status(200).json(
      out
    ).end();
  }
});

/**
 * Get restaurant approval data
 * @name GET/api/greatings/grId/restaurantId/approval
 * :grId - id of grEATing
 * @return the approval data for the grEATing with id grId
 */
router.get('/:grId/:restaurantId/approval', (req, res) => {
  if (Greatings.findGreating(req.params.grId) === undefined) {
    res.status(404).json({
      error: `grEAT with id ${req.params.grId} doesn't exist.`
    });
  } else {
    let approvals = Greatings.approvalInfo(req.params.grId, req.params.restaurantId);
    res.status(200).json(
        approvals
    ).end();
  }
});

/**
 * Approve a restaurant
 * @name POST/api/greatings/grId/restaurants/approve/
 * @return
 */
router.post('/:grId/restaurants/approve', (req, res) => {
    let approvals = Greatings.approve(req.params.grId, req.body.userEmail, req.body.restaurantID, req.body.level);
    res.status(200).json(
      approvals
    ).end();
});

/**
 * Select a restaurant
 * @name POST/api/greatings/restaurants/finalize
 * @return the chosen time (if exists) and chosen restaurant (if exists)
 */
router.post('/:grId/restaurants/finalize', (req, res) => {
    let out = Greatings.chooseRestaurant(req.params.grId, req.body.restaurant);
      res.status(200).json(out
    ).end();
});

/**
 * GET info about a grEATing
 * @name GET /api/greatings/grId
 * @return a grEATing object
 */
router.get('/:grId', (req, res) => {
  // don't need to copy because we're JSONifying
  res.end(JSON.stringify(Greatings.findGreating(req.params.grId)));
});

/**
 * Delete a grEATing
 * @name DELETE /api/greatings/:grId
 * :grId - id of the grEATing
 * @throws {404} if no greating with the specified id can be found
 */
router.delete('/:grId', (req, res) => {
  if (Greatings.removeGreating(req.params.grId)) {
    res.status(200).json().end();
  } else {
    res.status(404).json({
      error: `grEATing with id ${req.params.grID} doesn't exist.`
    }).end();
  }
});

/**
 * GET the email address and name of the greating organizer
 * @name GET /api/greatings/grId/organizer
 * @return an object of the form {email: 'organizer email address'}
 */
 router.get('/:grId/organizer', (req, res) => {
   let organizer = Greatings.findGreating(req.params.grId).organizer
   res.end(JSON.stringify({email: organizer.getEmailAddress(),
            firstName: organizer.getFirstName(),
            lastName: organizer.getLastName()}));
 })

 /**
  * GET information about invited users
  * @name GET /api/greatings/grId/invitedInfo
  * @return an object formatted like {invited: [member1, member2]}
  */
 router.get('/:grId/invitedInfo', (req, res) => {
   res.end(JSON.stringify({invited: Greatings.getInvitedIdentities(req.params.grId)}));
 });

/**
 * GET members
 * @name GET /api/greatings/grId/members
 * @return an object formatted like {members: [member1, member2]}
 */
router.get('/:grId/members', (req, res) => {
  res.end(JSON.stringify({members: Greatings.getMemberNames(req.params.grId)}));
});

/**
 * DELETE a member
 * @name DELETE /api/greatings/grId/members
 * @param email - the email address of the user to be deleted
 * @return
 */
router.delete('/:grId/members/:email', (req, res) => {
  let user = users.getUserByEmail(req.params.email);
  Greatings.removeMember(req.params.grId, user);
  res.end(JSON.stringify({email: req.params.email}));
});

/**
 * GET member info (first, last, and email)
 * @name GET /api/greatings/grId/memberInfo
 * @return an object formatted like {members: [member1, member2]}
 */
router.get('/:grId/memberInfo', (req, res) => {
  res.end(JSON.stringify({members: Greatings.getMemberIdentities(req.params.grId)}));
});

/* Search for users. */
router.post('/:grId/usersearch', (req, res) => {
  var query = decodeURIComponent(req.body.query);
  var userMatches = users.search(query);
  var memberInfos = Greatings.getMemberIdentities(req.params.grId);
  var invitedInfos = Greatings.getInvitedIdentities(req.params.grId);
  var memberResults = [];
  var invitedResults = [];
  var invitableResults = [];
  userMatches.forEach(user => {
    if (memberInfos.filter(info => user.sameInfo(info)).length) {
      memberResults.push(user.getInfo());
    } else if (invitedInfos.filter(info => user.sameInfo(info)).length) {
      invitedResults.push(user.getInfo());
    } else {
      invitableResults.push(user.getInfo());
    }
  });
  res.end(JSON.stringify({members: memberResults, invited: invitedResults, invitable: invitableResults}));
});

/**
 * Get restaurants for greating with grID
 * @name GET/api/greatings/:grID/restaurants/:sortby
 * :grID - id of grEATing to get restaurants for
 * :sortby - criteria to sort by
 * @return {Restaurants} - list of restaurants for the grEATing
 * @throws {404} - if grEATing with id grID doesn't exist
 */
router.get('/:grID/restaurants/:sortby', (req, res) => {
  if (Greatings.findGreating(req.params.grID) === undefined) {
    res.status(404).json({
      error: `grEAT with id ${req.params.grID} doesn't exist.`
    });
  } else {
    Greatings.loadRestaurants(req.params.grID, req.params.sortby).then(response => {
      res.status(200).json(response).end();
    });
  }
});

/**
 * Add criteria (restriction or preference) to the grEATing
 * @name POST/api/greatings/:grID/restaurants/criteria
 * :grID - id of grEATing to add criteria to
 * @param criteria - a list or set of restrictions or preferences to add to the grEATing
 * @return {Restaurants} - updated list of grEATing restaurants after applying the criteria
 * @throws {404} - if grEATing with id grID doesn't exist
 */
router.post('/:grID/restaurants/criteria', (req, res) => {
  if (Greatings.findGreating(req.params.grID) === undefined) {
    res.status(404).json({
      error: `grEATing with id ${req.params.grID} doesn't exist.`
    });
  } else {
    Greatings.addCriteria(req.params.grID, req.body.criteria, req.body.user).then(response => {
      res.status(200).json(response).end();
    });
  }
})

/**
 * Suggest a restaurant
 * @name PUT/api/greatings/grID/restaurants
 * @return
 */
router.put('/:grID/restaurants', (req, res) => {
  let user = users.getUserByEmail(req.body.email);
  Greatings.suggestRestaurant(req.params.grID, req.body.restaurant, user);
  res.status(200).json().end();
});

/**
 * Gets some representation of who’s free at what time for this greating grID
 * @name GET/api/greatings/schedule/availability
 * @return member's availabilities
 */
router.get('/:grID/schedule/availability', (req, res) => {
  if (req.session.username !== undefined) {
    signin();
  } else {
    res.status(200).json(Availability.getAvailUsers(req.params.grID)).end();
  }
});

/**
 * Updates the user's availability for this greating grID
 * @name POST/api/greatings/schedule/availability
 */
router.post('/:grID/schedule/availability', (req, res) => {
  if (req.session.username !== undefined) {
    signin();
  } else {
    let user = users.getUserByEmail(req.body.email);
    Availability.update(req.params.grID,req.body.updated,user)
    res.status(200).json().end();
  }
});

/**
 * Gets the current availability settings for this greating
 * (length of greating, date range, time range)
 * @name GET/api/greatings/schedule/info
 * @return current settings
 */
router.get('/:grID/schedule/info', (req, res) => {
  if (req.session.username !== undefined) {
    signin();
  } else {
    res.status(200).json(Availability.getInfo(req.params.grID)).end();
  }
});

/**
 * Updates the availability settings for this greating
 * @name PUT/api/greatings/schedule/info
 */
router.put('/:grID/schedule/info', (req, res) => {
  if (req.session.username !== undefined) {
    signin();
  } else {
    Availability.updateInfo(req.params.grID,req.body)
    res.status(200).json().end();
  }
});

/**
 * Gets the available timeblocks that exist for this grEATing
 * as well as the user's current availability.
 * @name GET/api/greatings/:grId/schedule/timeblocks/:email
 * @return user's current availability
 */
router.get('/:grID/schedule/timeblocks/:email', (req, res) => {
  if (req.session.username !== undefined) {
    signin(res);
  } else {
    let user = users.getUserByEmail(decodeURIComponent(req.params.email));
    const avail = Availability.myAvailability(req.params.grID,user);
    res.status(200).json(avail).end();
  }
});

/**
 * Gets a list of optimal starting time blocks for greating grID.
 * @name GET/api/greatings/schedule/optimal
 * @return the list of optimal starting time blocks
 */
router.get('/:grID/schedule/optimal', (req, res) => {
  if (req.session.username !== undefined) {
    signin(res);
  } else {
    const best = Availability.bestAvailability(req.params.grID);
    res.status(200).json(best).end();
  }
});

/**
 * Finalize a time for greating grID.
 * @name POST/api/greatings/schedule/finalize
 * @return the chosen time and chosen restaurant (if exists)
 */
router.post('/:grID/schedule/finalize', (req, res) => {
  let out = Greatings.chooseTime(req.params.grID, parseInt(req.body.time));
    res.status(200).json(out
  ).end();
});

const signin = function(res){res.status(401).json({
  error: `Please sign in.`,
  }).end();}

const access = function(res){res.status(403).json({
  error: `Invalid access. You are not the organizer of the grEATing.`,
}).end();}

module.exports = router;
