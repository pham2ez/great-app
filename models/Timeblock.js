let User = require('./User.js');
/**
 * Returns an object representing a 15-minute time block.
 * Note that each Timeblock object is used only for a single grEATing.
 *
 * @param startTime        A Date representing the start time of this time block.
 * @return                 A Timeblock representing a 15-minute time block starting at startTime.
 */
const Timeblock = function(startTime) {
  
  const that = Object.create(Timeblock.prototype);
  
  // "private fields"

  // a list of User objects who are free during this timeblock.
  const users = [];

  // true iff this Timeblock is active
  // (which is true iff all attendees of the grEATing can see and interact with this this Timeblock)
  var isActive = true;
  
  // "public methods"

  /**
   * Adds a user to the list of available users in this Timeblock.
   * @return    true iff this user was added to the Timeblock.
   */
  that.addUser = function(user) {
    let member = users.filter(u => u.getEmailAddress() === user.getEmailAddress())[0];
    if (member !== undefined) {
      return false;
    } else {
      users.push(user);
      return true;
    }
  }

  /**
   * Deletes a user from the list of available users in this Timeblock.
   * @param user  The user to be deleted.
   * @return      true iff this user was deleted from the Timeblock.
   */
  that.deleteUser = function(user) {
    // find all matches for this user (there should only be 1)
    var validIndices = users.map((u, i) => { if (u.getEmailAddress() === user.getEmailAddress()) return i })
                             .filter((i) => i !== undefined);
    if (validIndices.length === 0) {
      return false;
    } else if (validIndices.length > 1) { // More than 1 instance of the user was found!
      return false;
    } else {
      users.splice(validIndices[0], 1);
      return true;
    }
  }

  /**
   * @return    a list of users who are available in this Timeblock.
   */
  that.getAvailableUsers = function() {
    return users.map(user => {return user.getFirstName() + " " + user.getLastName()});
  }

  /**
   * @user the email address of the user
   * @return if user is in this timeblock
   */
  that.includes = function(user) {
    let member = users.filter(u => u.getEmailAddress() === user.getEmailAddress())[0];
    if (member !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @return    the end time of this Timeblock.
   */
  that.getEndTime = function() {
    // 15 min = 900000 ms
    const ms = startTime.getTime() + 900000;
    return new Date(ms);
  }
    
  /**
   * @return    true iff this Timeblock is active.
   */
  that.getIsActive = function() {
    return isActive;
  }
  
  /**
   * @return    the number of users who are available in this Timeblock.
   */
  that.getNumAvailableUsers = function() {
    return users.length;
  }
  
  /**
   * @return    the start time of this Timeblock.
   */
  that.getStartTime = function() {
    return startTime;
  }

  /**
   * @param user   The user of interest.
   * @return       true iff user is available during this Timeblock.
   */
  that.isAvailable = function(user) {
    return users.includes(user);
  }
 
  /**
   * Sets the active state of this Timeblock.
   *
   * @param state  true iff the Timeblock should now be active.
   */
  that.setIsActive = function(state) {
    isActive = state;
  }
  // only private fields (closure variables) can change--actual fields can't.
  return Object.freeze(that);
}

// Make a Timeblock by using:
// const Timeblock = require(path/to/this/file);
// var myTimeblock = Timeblock(startTime);
module.exports = Timeblock;