const Notification = require('./Notification.js').Notification;
const Invite = require('./Notification.js').Invite;
const users = require('./users.js');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

// keep a list of all notifications, with the most recent first
var notifications = [];
// keep an object which maps greatings to lists of scheduled functions
var greatingIdToEmailSchedule = {};

const getNotificationsForEmail = function(email) {
  return notifications.filter(n => n.getEmail() === email).map(n => n.show()).slice(0, 5);
}
module.exports.getNotificationsForEmail = getNotificationsForEmail;

const addNotification = function(info) {
  var type = info.type;
  if (type !== 'new member' && type !== 'new craving' && type !== 'finalize time' && type !== 'finalize place' && type !== 'cancel time' && type !== 'cancel place' && type !== 'invite') {
    new Error('invalid type.');
  }
  var grId = info.grId;
  var grTitle = info.grTitle;
  var user = info.user;
  if (type === 'invite') {
    notifications.filter(n => !(n.getGreatingId() === grId && n.getEmail() === user.getEmailAddress() && n.isInvite()));
    notifications.unshift(Invite(grId, grTitle, user));
    return;
  } else {
    var notificationsForGrId = notifications.filter(n => n.getGreatingId() === grId && !n.isInvite());
    notifications = notifications.filter(n => n.getGreatingId() !== grId);
    var notificationsForGrIdForUser = notificationsForGrId.filter(n => n.getEmail() === user.getEmailAddress());
    if (notificationsForGrIdForUser.length > 1) {
      new Error('For each pair of grEATing and user, there should be at most 1 non-invite notification');
    } else if (notificationsForGrIdForUser.length === 1) {
      notification = notificationsForGrIdForUser[0];
    } else {
      // no notification object currently exists; make a new one
      notification = Notification(grId, grTitle, user);
      notifications.unshift(notification);
    }
    if (type === 'new member') {
      notification.addMember();
    } else if (type === 'new craving') {
      notification.addCraving();
    } else if (type === 'finalize time') {
      notification.finalizeTime();
    } else if (type === 'cancel time') {
      notification.cancelTime();
    } else if (type === 'finalize place') {
      notification.finalizePlace();
    } else if (type === 'cancel place') {
      notification.cancelPlace();
    }
    notifications = notificationsForGrId.concat(notifications);
  }
}
module.exports.addNotification = addNotification;

const getNotificationById = function(nid) {
  // use double equals because nid is a String and n.getId() is an int
  var notificationsWithId = notifications.filter(n => n.getId() == nid);
  if (notificationsWithId.length > 1) {
    new Error('found more than 1 notification with id ' + nid);
  }
  return notificationsWithId[0];
}

const viewNotification = function(nid) {
  getNotificationById(nid).view();
}
module.exports.viewNotification = viewNotification;


const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'uoyx4ucui9@gmail.com',
        pass: 'zy9zbwir9sDdBZ02',
    },
});

const sendDigest = function() {
  users.getDigestEmailAddresses().forEach(e => {
    var notifications = getNotificationsForEmail(e);

    var today = new Date();
    var date = (today.getMonth()+1) + '/' + today.getDate() + '/' + today.getFullYear();
              
    var notificationHtml = '';
                                          
    notifications.forEach(notification => {
      if (!notification.viewed) {
        notificationHtml += `<div><h3>${notification.grTitle}</h3><p style='white-space: pre'>${notification.notificationText}</p></div>`
      }
    })
                                          
                                          
    const mailOptions = {
      from: 'uoyx4ucui9@gmail.com',
      to: e,
      subject: 'Your grEATing notifications for ' + date,
      html: notificationHtml,
    };
                                          
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
         console.log(error);
         new Error(error);
      }
    });
  });
}

// minutes, hours, day of month, month, year
schedule.scheduleJob('0 0 * * *', () => { sendDigest(); }) // run everyday at midnight

const scheduleEmailNotifications = function(greating) {
  if (greatingIdToEmailSchedule[greating.id] !== undefined) {
    greatingIdToEmailSchedule[greating.id].forEach(j => {
      if (j != null) {
        j.cancel();
      }
    });
    greatingIdToEmailSchedule[greating.id] = undefined;
  }
  
  var t = new Date(parseInt(greating.chosenTime));
  
  // Two days before
  var twoDaysBefore = new Date();
  twoDaysBefore.setTime(t.getTime() - (24*60*60*1000) * 2);
  var twoDaysBeforeJob = schedule.scheduleJob(twoDaysBefore, () => {
    // If the restaurant isn't also finalized, do nothing
    if (greating.restaurantId === undefined) {
      return;
    }
    greating.members.forEach(m => {
      if (m.getEmailTime() === '2 days before') {
                             
        var notificationHtml = `<b>${greating.title}</b> is occurring at ${greating.restaurantId.name} at ${t.getHours()}:${t.getMinutes()}`;
                             
        const mailOptions = {
          from: 'uoyx4ucui9@gmail.com',
          to: m.getEmailAddress(),
          subject: 'Your grEATing is in 2 days',
          html: notificationHtml,
        };
                                                                
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            new Error(error);
          }
        });
      }
    });
  });
    
  // One day before
  var oneDayBefore = new Date();
  oneDayBefore.setTime(t.getTime() - (24*60*60*1000) * 1);
  var oneDayBeforeJob = schedule.scheduleJob(oneDayBefore, () => {
    // If the restaurant isn't also finalized, do nothing
    if (greating.restaurantId === undefined) {
      return;
    }
    greating.members.forEach(m => {
      if (m.getEmailTime() === '1 day before') {
        var notificationHtml = `<b>${greating.title}</b> is occurring at ${greating.restaurantId.name} at ${t.getHours()}:${t.getMinutes()}`;
                             
        const mailOptions = {
          from: 'uoyx4ucui9@gmail.com',
          to: m.getEmailAddress(),
          subject: 'Your grEATing is in 1 day',
          html: notificationHtml,
        };
                                                                
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            new Error(error);
          }
        });
      }
    });
  });
                                             
  // One hour before
  var oneHourBefore = new Date();
  oneHourBefore.setTime(t.getTime() - (60*60*1000));
  var oneHourBeforeJob = schedule.scheduleJob(oneHourBefore, () => {
    // If the restaurant isn't also finalized, do nothing
    if (greating.restaurantId === undefined) {
      return;
    }
    greating.members.forEach(m => {
      if (m.getEmailTime() === '1 hour before') {
        var notificationHtml = `<b>${greating.title}</b> is occurring at ${greating.restaurantId.name} at ${t.getHours()}:${t.getMinutes()}`;
                              
        const mailOptions = {
          from: 'uoyx4ucui9@gmail.com',
          to: m.getEmailAddress(),
          subject: 'Your grEATing is in 1 hour',
          html: notificationHtml,
        };
                                                                
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            new Error(error);
          }
        });
      }
    });
  });
  greatingIdToEmailSchedule[greating.id] = [twoDaysBeforeJob, oneDayBeforeJob, oneHourBeforeJob];
}
module.exports.scheduleEmailNotifications = scheduleEmailNotifications;
