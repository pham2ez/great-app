let Timeblock = require('./Timeblock.js');
let User = require('./User.js');
let users = require('./users.js');
let Availability = require('./Availability.js');
let Restaurants = require('./Restaurants.js');
let Location = require('./Location.js');
let Utils = require('./Utils.js');
const uniqid = require('uniqid');
const uniqueHash = require("unique-hash").default;
const notifications = require('./notifications.js');

const all_restrictions = new Set(['vegetarian', 'vegan', 'kosher', 'gluten-free', 'lactose-free', 'halal']);
const all_preferences = new Set(['mexican food', 'italian food', 'american food', 'chinese food', 'korean food',
'japanese food', 'mediterranean food']);

/**
 * @typedef Greating
 * @prop {string} title - the unique name of this greating
 * @prop {array} members - the users who are in this greating
 * @prop {User} organizer - the organizer of the greating
 * @prop {map} approvals  - a map of restaurants that have been approved to a list of Users who have approved them,
 * @prop {string} status - the status of the greating (either 'Finalized' or 'In Progress')
 * @prop {string} restaurantId - the id of the chosen restaurant
 * @prop {string} chosenTime - the Date object of the chosen time
 * @prop {Restaurant[]} restaurants - list of suggested/curated restaurants
 * @prop {Location} searchLocation - location to search restaurants near
 * @prop {string[]} restrictions - current restrictions in the greating
 * @prop {Object} preferences - current preferences in the greating, mapped by user
 * @prop {string} sortby - criteria to sort results by
 * @prop {} idHash
 * @prop {array} invites - a list of email addresses for invited users
 */

 greatings = [];

 /**
  * @class Greatings
  * Stores all Greatings across all users
  */

 class Greatings {
   static findGreating(id) {
     return greatings.filter(g => g.id === id)[0];
   }

   static findGreatingWithHash(idHash) {
     return greatings.filter(g => g.idHash === idHash)[0];
   }

   /**
    * Create a grEATing.
    * @param {string} name - name of grEATing
    * @param {User} creator - creator of grEATing
    */
   static createGreating(name, creator) {
     var grId = uniqid();
     let greating = {
       id: grId,
       title: name,
       members: [creator], // Doesn't yet handle if organizer is not a member
       organizer: creator,
       approvals: new Map(),
       restaurantId: undefined,
       chosenTime: undefined,
       status: 'In Progress',
       restaurants: [],
       searchLocation: undefined,
       restrictions: [],
       preferences: {},
       sortby: 'bestfit',
       idHash: uniqueHash(grId, {format: 'string'}),
       invites: []
     };
     greatings.push(greating);
     return grId;
   }

   /**
    * Delete a greating entirely
    * @param id - the id of the greating to be deleted
    * @return true iff the greating existed and was deleted
    */
   static removeGreating(id) {
     let greatingFound = (Greatings.findGreating(id).length !== 0);
     greatings = greatings.filter(g => g.id !== id);
     return greatingFound;
   }

   /**
   * Add a member to a specified grEATing
   * @param {int} id - the unique id of the greating
   * @param {User} user - user to be added to the grEATing
   */
   static addMember(id, user) {
     let greating = greatings.filter(g => g.id === id)[0];

     // Manage notifications
     greating.members.forEach(u => {
       if (u.getNotificationPreferences().includes('new member')) {
         notifications.addNotification({grId: greating.id, grTitle: greating.title, user: u, type: 'new member'});
       }
     });

     // Now add the new user (this user should not be notified of a new member)
     if (!greating.members.includes(user)) {
       greating.members.push(user);
     }

     // Remove user email from invites
     greating.invites = greating.invites.filter(m => m.getEmailAddress() !== user.getEmailAddress());
   }

   /**
    * Invite a member to a specified grEATing
    * @param {int} id - the unique id of the greating
    * @param {string} email - email address of a user to be invited to the grEATing
    */
    static inviteMember(id, email) {
      let greating = greatings.filter(g => g.id === id)[0];
      var user = users.getUserByEmail(email);
      if (user === undefined) {
        return;
      }
      if (!greating.invites.includes(user)) {
        greating.invites.push(user);
        if (user.getNotificationPreferences().includes('invite')) {
          notifications.addNotification({grId: id, grTitle: greating.title, user: user, type: 'invite'});
        }
      }
    }

   /**
    * Decline an invite to a specified grEATing
    * @param {int} id - the unique id of the greating
    * @param {string} user - the user that is declining the greating
    */
   static declineInvite(id, user) {
     let greating = greatings.filter(g => g.id === id)[0];
     greating.invites = greating.invites.filter(u => u.getEmailAddress() !== user.getEmailAddress());
   }

   /**
   * Remove a member from a specified grEATing
   * @param {int} id - the unique id of the greating
   * @param {User} member - User to be removed from the grEATing
   */
   static removeMember(id, member) {
     let greating = greatings.filter(g => g.id === id)[0];
     greating.members = greating.members.filter(m => m !== member);

     // Remove user's approval information if they leave/are removed
     let restaurantIds = Array.from(greating.approvals.keys());
     restaurantIds.forEach(r => function(r) {
       let approvalData = greating.approvals.get(r);
       approvalData.get('Love').delete(member);
       approvalData.get('Like').delete(member);
       approvalData.get('Dislike').delete(member);
     });

     //Remove user's availability information
     Availability.clearUser(id, member);
   }

   /**
    * Update search location for a grEATing. If no location is provided,
    * location is calculated based on addresses of all members of the grEATing.
    * @param {} id - id of grEATing
    * @param {*} newLocation - optional parameter to specify new location to set to
    */
   static async updateLocation(id, newLocation=undefined) {
     let greating = greatings.filter(g => g.id === id)[0];
     if (newLocation) {
       greating.searchLocation = newLocation;
     } else {
      // get best search location for all members
      let locations = [];
      let members = greating.members;
      members.forEach(m => {
        if (m.getAddress().isEmpty()) {
          locations.push(Location.getCoordinatesFromZip(m.getZipCode()));
        } else {
          locations.push(Location.getCoordinatesFromAddress(m.getAddress()).then(response =>
            {return response}));
          }
      });
      locations = await Promise.all(locations);
      greating.searchLocation = Location.getAverageLocation(locations);
    }
   }

   /**
    * Initialize a list of restaurants for this grEATing,
    * based on dietary restrictions and user locations.
    * Only restaurants that satisfy one or more restriction are returned.
    * @param {int} id - the unique if of the greating
    * @return restaurants for this grEATing
    */
   static async initializeRestaurants(id) {
    let greating = greatings.filter(g => g.id === id)[0];
    let members = greating.members;
    // set search location
    await Greatings.updateLocation(id);
    console.log('search location');
    console.log(greating.searchLocation);
    // get all restrictions from users of grEAT
    let restrictions = new Set();
    members.forEach(m =>
      restrictions = new Set(function*() { yield* restrictions; yield* m.getRestrictions(); }())
    );
    console.log('restrictions');
    console.log(restrictions);
    greating.restrictions = [...restrictions];
    // get restaurants satisfying restrictions
    let restaurants = [];
    if (greating.restrictions.length > 0) {
      greating.restrictions.forEach(restriction => {
          restaurants.push(Restaurants.loadWithCriteria(restriction, greating.searchLocation).then(response =>
            {return response}));
          // restaurants.push(response);
        }
      );
      restaurants = await Promise.all(restaurants);
    } else {
      let response = await Restaurants.loadRestaurants(greating.searchLocation);
      restaurants.push(response);
    }
    greating.restaurants = Greatings.sort(Restaurants.consolidate(restaurants), 'bestfit');
    return greating.restaurants;
   }

   /**
    * Return restaurants associated with this grEATing.
    * @param {string} id - the unique id of the greating
    * @param {string} sortby - criteria to sort by
    */
   static async loadRestaurants(id, sortby) {
    let greating = greatings.filter(g => g.id === id)[0];
    // greating.sortby = sortby;
    if (greating.restaurants.length > 0) {
      const oldLocation = greating.searchLocation;
      await Greatings.updateLocation(id);
      let restrictions = new Set();
      let members = greating.members;
      members.forEach(m =>
        restrictions = new Set(function*() { yield* restrictions; yield* m.getRestrictions(); }())
      );
      restrictions = [...restrictions];
      console.log('restrictions');
      console.log(restrictions);
      // only load new results if restrictions or location changed
      if (!Utils.containsSame(greating.restrictions, restrictions) ||
           (oldLocation.lat !== greating.searchLocation.lat || oldLocation.lon !== greating.searchLocation.lon)
           || greating.sortby !== sortby) {
        greating.sortby = sortby;
        greating.restrictions = restrictions;
        let restaurants = await Greatings.addCriteria(id, restrictions);
        return restaurants;
      } else {
        return greating.restaurants;
      }
    } else {
      let restaurants = await Greatings.initializeRestaurants(id);
      return restaurants;
    }
   }

   /**
    * Get all preferences in a grEATing
    * @param {*} id - id of grEATing
    */
   static getAllPreferences(id) {
     let greating = greatings.filter(g => g.id === id)[0];
     let preferences = [];
     Object.values(greating.preferences).forEach(prefs => preferences.push(...prefs));
     return preferences;
   }

   /**
    * Add new preferences/restrictions to the grEATing.
    * @param {string} id
    * @param {string} criteria - new criteria to apply to restaurants
    * @param {string} user - email address of the user who added a preference
    */
   static async addCriteria(id, criteria, user=undefined) {
     let greating = greatings.filter(g => g.id === id)[0];
     let allRestaurants = [greating.restaurants];
     if (user) {
       greating.preferences[user] = criteria;
     }
     criteria.forEach(crit => {
      allRestaurants.push(Restaurants.loadWithCriteria(crit, greating.searchLocation).then(response =>
        {return response}));
     });
     allRestaurants = await Promise.all(allRestaurants);
     console.log('restrictions/preferences');
     console.log([...greating.restrictions, ...Greatings.getAllPreferences(id)]);
     greating.restaurants = Greatings.sort(Restaurants.consolidate(allRestaurants, [...greating.restrictions, ...Greatings.getAllPreferences(id)]), greating.sortby, id);

     // Manage notifications
     greating.members.forEach(u => {
       if (u.getNotificationPreferences().includes('new craving')) {
         notifications.addNotification({grId: greating.id, grTitle: greating.title, user: u, type: 'new craving'}); // TODO - maybe change notification type
       }
     });

     return greating.restaurants;
   }

   /**
    * Return restaurants associated with this grEATing.
    * @param {int} id - the unique id of the greating
    */
   static suggestRestaurant(id, rest, user) {
    let greating = greatings.filter(g => g.id === id)[0];
    rest.suggestedBy = `${user.getFirstName()} ${user.getLastName()}`
    greating.restaurants.push(rest);

    // Manage notifications
    greating.members.forEach(u => {
      if (u.getNotificationPreferences().includes('new craving')) {
        notifications.addNotification({grId: greating.id, grTitle: greating.title, user: u, type: 'new craving'}); // TODO - maybe change notification type
      }
    });
   }

   /**
   * Approve a given restaurant
   * @param {int} id - the unique id of the greating
   * @param {User} member - User approving
   * @param {Restaurant} restaurant - the restaurant being approved
   * @param {string} level - either 'Love', 'Like', or 'Dislike'
   * @return {Object} formatted like {loves: {int}, likes: {int}, dislikes: int }
   *
   * If the user has already approved the restaurant, this action replaces it
   */
   static approve(id, member, restaurant, level) {
     restaurant = restaurant;
     let greating = Greatings.findGreating(id);
     let restaurantApprovals =  greating.approvals.get(restaurant);

     // Add approval if user has not yet approved this restaurant
     if (!greating.approvals.has(restaurant)){
       // Build empty map of user approval levels
       let levels = new Map();
       levels.set('Love', new Set());
       levels.set('Like', new Set());
       levels.set('Dislike', new Set());
       levels.get(level).add(member); // Add the user's approval level

       // Add this info to the restaurant approvals data
       greating.approvals.set(restaurant, levels);
     } else {
       // Find all existing approval data for this restaurant
       let usersLove = restaurantApprovals.get('Love');
       let usersLike = restaurantApprovals.get('Like');
       let usersDislike = restaurantApprovals.get('Dislike');

       let userPast = '';

       // Clear user's past approval info
       if (usersLove.has(member)){
         usersLove.delete(member);
         userPast = 'Love';
       } else if (usersLike.has(member)) {
         usersLike.delete(member);
         userPast = 'Like';
       } else if (usersDislike.has(member)) {
         usersDislike.delete(member);
         userPast = 'Dislike';
       }

       // Update with new user approval info
       if (userPast !== level) {
         restaurantApprovals.get(level).add(member);
       }
     }

     // Return all approval info for this restaurant
     return {loves: greating.approvals.get(restaurant).get('Love').size,
             likes: greating.approvals.get(restaurant).get('Like').size,
             dislikes: greating.approvals.get(restaurant).get('Dislike').size};
   }

   /**
   * Get approval data for a given restaurant
   * @param {int} id - the unique id of the greating
   * @param {Restaurant} restaurant - the restaurant being approved
   * @return {Object} formatted like {loves: {int}, likes: {int}, dislikes: int }
   *
   * If the user has already approved the restaurant, this action replaces it
   */
   static approvalInfo(id, restaurant) {
      let greating = Greatings.findGreating(id);
      if (!greating.approvals.has(restaurant)) {
        return {loves: 0, likes: 0, dislikes: 0};
      }

     // Return all approval info for this restaurant
     return {loves: greating.approvals.get(restaurant).get('Love').size,
             likes: greating.approvals.get(restaurant).get('Like').size,
             dislikes: greating.approvals.get(restaurant).get('Dislike').size};
   }

   static getApprovalScore(id, restaurant) {
    let approval = Greatings.approvalInfo(id, restaurant);
    return approval.loves * 2 + approval.likes - approval.dislikes * 2;
   }

    /**
     * Sort restaurants from most tags satisfied to least tags satisfied
     * TODO: make this prioritize restrictions
     * @param {*} restaurants - restaurants to sort
     * @param {string} sortby - criteria to sort by
     * @param {string} id - id of grEATing to sort for
     */
    static sort(restaurants, sortby, id=undefined) {
      if (sortby === 'bestfit') {
          return restaurants.sort((a, b) => (a.score > b.score ? -1: 1));
      } else {
          return restaurants.sort((a, b) => (Greatings.getApprovalScore(id, a.place_id) > Greatings.getApprovalScore(id, b.place_id) ? -1: 1));
      }
  }

   /**
   * Finalize the restaurant choice
   * @param {int} greatingId - the id of the greating
   * @param {int} restaurantId - the id of the chosen restaurant
   */
   static chooseRestaurant(greatingId, restaurant){
     let greating = Greatings.findGreating(greatingId);
     greating.restaurantId = {id: restaurant.place_id, name: restaurant.name};
     if(greating.restaurantId !== undefined && greating.chosenTime !== undefined){
       console.log('Finalized greating');
       greating.status = 'Finalized';
     }

     // Manage notifications
     // Manage notifications
     greating.members.forEach(u => {
       if (u.getNotificationPreferences().includes('finalize place')) {
         notifications.addNotification({grId: greating.id, grTitle: greating.title, user: u, type: 'finalize place'});
       }
     });

     return {restaurant: greating.restaurantId,
            title: greating.title,
            time: greating.chosenTime,
            status: greating.status};
   }

   /**
   * Finalize the time
   * @param {int} greatingId - the id of the greating
   * @param {int} time - the chosen time
   */
  static chooseTime(greatingId, time){
    let greating = Greatings.findGreating(greatingId);
    greating.chosenTime = time;
    if(greating.restaurantId !== undefined && greating.chosenTime !== undefined){
      console.log('Finalized greating');
      greating.status = 'Finalized';
     }

    // Manage notifications
    greating.members.forEach(u => {
      if (u.getNotificationPreferences().includes('finalize time')) {
        notifications.addNotification({grId: greating.id, grTitle: greating.title, user: u, type: 'finalize time'});
      }
    });
    notifications.scheduleEmailNotifications(greating);

    return {restaurant: greating.restaurantId,
           title: greating.title,
           time: greating.chosenTime,
           status: greating.status};
  }

   /**
   * Find grEATings with a certain member.
   * @param {string} email - the email of the member of interest
   * @return {array} list of grEATings that have that member
   */
   static findGreatingsWithMember(email) {
     // User belongs to a greating if they are a member OR the organizer.
     let memberOf = greatings.filter(g => g.members.filter(m => m.getEmailAddress() === email).length > 0);
     let organizerOf = greatings.filter(g => g.organizer.getEmailAddress() === email);

     // Want the union of the two arrays so as not to double display
     return Array.from(new Set(memberOf.concat(organizerOf)));
   }

   /**
   * Find grEATings to which a certain member was invited.
   * @param {string} email - the email of the member of interest
   * @return {array} list of grEATings that have invited member
   */
   static findGreatingsWithInvitedMember(email) {
     return greatings.filter(g => g.invites.filter(m => m.getEmailAddress() === email).length > 0);
   }

   /**
   * Return the members of a certain grEATing.
   * @param {int} greatingId - the id of the greating of interest
   * @return {array} list of members' names of that grEATing
   */
   static getMemberNames(greatingID) {
     var greating = Greatings.findGreating(greatingID);
     var names = [];
     greating.members.forEach(member => {
      names.push(member.getFirstName() + ' ' + member.getLastName());
     });
     return Object.freeze(names);
   }

   /**
   * Return the members of a certain grEATing.
   * @param {int} greatingId - the id of the greating of interest
   * @return {array} list of identifying info for members of that grEATing
   */
   static getMemberIdentities(greatingID) {
     var greating = Greatings.findGreating(greatingID);
     var info = [];
     greating.members.forEach(member => {
      info.push(member.getInfo());
      });
     return Object.freeze(info);
   }

   /**
     * Return the invitees of a certain grEATing.
     * @param {int} greatingId - the id of the greating of interest
     * @return {array} list of identifying info for invitees of that grEATing
     */
     static getInvitedIdentities(greatingID) {
       var greating = Greatings.findGreating(greatingID);
       var info = [];
       greating.invites.forEach(member => {
        info.push(member.getInfo());
        });
       return Object.freeze(info);
     }

   /**
   * Return true iff the user is an attendee of the grEATing with ID greatingId.
   * @param {int} user - the user of interest
   * @param {int} greatingId - the id of the greating of interest
   * @return {boolean} true iff the user is an attendee of the grEATing
   */
   static isMember(user, greatingId) {
     var greating = Greatings.findGreating(greatingId);
     return greating.members.filter(u => u === user).length;
   }

   /**
   * Return true iff the user is the organizer of the greating.
   * @param {int} user - the user of interest
   * @param {int} greatingId - the id of the greating of interest
   * @return {boolean} true iff the user is the organizer of the grEATing
   */
   static isOrganizer(user, greatingId) {
     var greating = Greatings.findGreating(greatingId);
     return greating.organizer === user;
   }
}
module.exports = Greatings;
