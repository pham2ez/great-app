// use this to make ids for notifications
var numNotifications = 0;

/**
 * Make a Notification.
 */
const Notification = function(grId, grTitle, user) {
  
  var that = Object.create(Notification.prototype);
  
  // make an ID and increment the count
  var nId = numNotifications;
  numNotifications++;
  
  var numNewMembers = 0;
  var numNewCravings = 0;
  var isTimeFinalized = undefined;
  var isPlaceFinalized = undefined;
  var isViewed = false;
  
  const reset = function() {
    if (isViewed) {
      numNewMembers = 0;
      numNewCravings = 0;
      isTimeFinalized = undefined;
      isPlaceFinalized = undefined;
      isViewed = false;
    }
  }
  
  that.getGreatingId = function() {
    return grId;
  }
  
  that.getId = function() {
    return nId;
  }
  
  that.getEmail = function() {
    return user.getEmailAddress();
  }
  
  that.addMember = function() {
    reset();
    numNewMembers++;
  }
  
  that.addCraving = function() {
    reset();
    numNewCravings++;
  }
  
  that.finalizeTime = function() {
    reset();
    isTimeFinalized = true;
  }
  
  that.cancelTime = function() {
    reset();
    isTimeFinalized = false;
  }
  
  that.finalizePlace = function() {
    reset();
    isPlaceFinalized = true;
  }
  
  that.cancelPlace = function() {
    reset();
    isPlaceFinalized = false;
  }
  
  that.show = function() {
    var notificationText = '';
    if (numNewMembers === 1) {
      notificationText += '1 new member was added\n';
    } else if (numNewMembers > 1) {
      notificationText += numNewMembers + ' new members were added\n';
    }
    if (numNewCravings === 1) {
      notificationText += 'New restaurants may have been added\n';
    } else if (numNewCravings > 1) {
      notificationText += 'New restaurants may have been added\n';
    }
    if (isTimeFinalized !== undefined) {
      if (isTimeFinalized === true) {
        notificationText += 'Time was finalized\n';
      } else if (isTimeFinalized === false) {
        notificationText += 'Time was canceled\n';
      }
    }
    if (isPlaceFinalized !== undefined) {
      if (isPlaceFinalized === true) {
        notificationText += 'Place was finalized\n';
      } else if (isPlaceFinalized === false) {
        notificationText += 'Place was canceled\n';
      }
    }
    // Get rid of trailing \n
    notificationText = notificationText.substring(0, notificationText.length - 1);
    return {
      id: nId,
      grId: grId,
      grTitle: grTitle,
      notificationText: notificationText,
      viewed: isViewed,
      event: 'showGreating',
    }
  }
    
  that.view = function() {
    isViewed = true;
  }
  
  that.isInvite = function() {
    return false;
  }

  return Object.freeze(that);
}

/**
 * Make an invite notification.
 */
const Invite = function(grId, grTitle, user) {
  
  var that = Object.create(Invite.prototype);
  
  // make an ID and increment the count
  var nId = numNotifications;
  numNotifications++;
  
  var isViewed = false;
  
  that.getGreatingId = function() {
    return grId;
  }
  
  that.getId = function() {
    return nId;
  }
  
  that.getEmail = function() {
    return user.getEmailAddress();
  }
  
  that.show = function() {
    return {
      id: nId,
      grId: grId,
      grTitle: grTitle,
      notificationText: 'You have been invited to join the greating!',
      viewed: isViewed,
      event: 'showInvites',
    }
  }
    
  that.view = function() {
    isViewed = true;
  }
  
  that.isInvite = function() {
    return true;
  }
  
  return Object.freeze(that);
}

module.exports = {Notification: Notification, Invite: Invite};
