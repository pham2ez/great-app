const express = require('express');
const users = require('../models/users');
const notifications = require('../models/notifications');
const Notification = require('../models/Notification');

const router = express.Router();

/**
 * Get notifications for the user with email address email.
 * :email - user's email
 * @return {string} - notifications
 */
router.get('/:email', (req, res) => {
  res.end(JSON.stringify({notifications: notifications.getNotificationsForEmail(decodeURIComponent(req.params.email))}));
});

/**
 * Get notification preferences for the user with email address email.
 * :email - user's email
 * @return {Object} with fields:
 *    preferences: a list of the user's notification preferences
 */
router.get('/:email/preferences', (req, res) => {
  var user = users.getUserByEmail(decodeURIComponent(req.params.email));
  res.end(JSON.stringify({preferences: user.getNotificationPreferences(), emailtime: user.getEmailTime()}));
});

/**
 * Set notification preferences for the user with email address email.
 * :email - user's email
 * @param preferences - a list of new preferences for this user
 * @return success message - if successful
 */
router.put('/:email/preferences', (req, res) => {
  var user = users.getUserByEmail(decodeURIComponent(req.params.email));
  user.setNotificationPreferences(req.body.preferences);
  user.setEmailTime(req.body.emailtime);
  res.end('Your preferences were successfully set!');
});

/**
 * Mark a notification as viewed.
 * @name PUT/api/notifications/:nid
 * @param nid - notification id
 */
router.put('/:nid', (req, res) => {
  notifications.viewNotification(req.params.nid);
  res.end('You successfully marked the notification with ID ' + req.params.nid + ' as viewed.')
});

module.exports = router;
