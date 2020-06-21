const User = require('./User');

// "private fields"
var users = [];

/**
 * Delete the User with ID userId.
 *
 * @param userId   The userId corresponding to the User which needs to be deleted.
 */
const deleteUser = function(userId) {
  users[userId] = undefined;
}
module.exports.deleteUser = deleteUser;

/**
 * Gets the user ID given an email.
 *
 * @param email       The email of interest.
 * @return            The user ID for that email, or undefined if no such user.
 */
const getIdByEmail = function(email) {
  var validIds = users.map(function(user, i) {
    if (user !== undefined && user.getEmailAddress() === email) return i;
  }).filter((id) => id !== undefined);
  if (validIds.length === 0) {
    return undefined;
  } else if (validIds.length > 1) {
    new Error('More than 1 user with email address ' + email + ' was found!');
  } else {
    return validIds[0];
  }
}
module.exports.getIdByEmail = getIdByEmail;

/**
 * Gets the user object given a user ID.
 *
 * @param username    The user ID of interest.
 * @return            The user object with that ID.
 */
const getUserById = function(id) {
  return users[id];
}
module.exports.getUserById = getUserById;

/**
 * Gets the user object given a email.
 *
 * @param email       The email of interest.
 * @return            The user object with that email, or undefined if no such user.
 */
const getUserByEmail = function(email) {
  let id = getIdByEmail(email);
  if (id !== undefined) {
    return getUserById(id);
  }
}
module.exports.getUserByEmail = getUserByEmail;

/**
 * Gets the email given a user ID.
 *
 * @param id          The user ID of interest.
 * @return            The email associated with that ID.
 */
const getEmailById = function(id) {
  var user = getUserById(id);
  if (user === undefined) {
    return undefined;
  } else {
    return user.getEmailAddress();
  }
}
module.exports.getEmailById = getEmailById;

/**
 * Create a new User and add that User to our info container.
 * Returns true if the user was successfully created.
 * If the username is already taken, returns false.
 *
 * @param firstName     The first name of the new User.
 * @param lastName      The last name of the new User.
 * @param email         The email address of the new User.
 * @param passwordHash  The password hash of the new User.
 * @param zipCode       The zip code of the new User.
 * @return              True iff the user was successfully created.
 */
const newUser = function(firstName, lastName, email, passwordHash, zipCode) {
  if (getUserByEmail(email) === undefined) {
    users.push(User(firstName, lastName, email, passwordHash, zipCode));
    return true;
  } else {
    return false;
  }
}
module.exports.newUser = newUser;

/**
 * Return a list of Users whose first names, last names, or email addresses prefix-match a query, case-insensitively.
 *
 * @param query         A query string.
 * @return              Any Users whose first names, last names, or email addresses prefix-match the query, case-insensitively.
 */
const search = function(query) {
  var matches = new Set();
  var subqueries = query.toLowerCase().split(' ');
  users.forEach(user => {
    if (user !== undefined) {
      subqueries.forEach(subquery => {
        if (user.getFirstName().toLowerCase().startsWith(subquery) || user.getLastName().toLowerCase().startsWith(subquery) || user.getEmailAddress().startsWith(subquery)) {
          matches.add(user);
        }
      })
    }
  });
  return matches;
}
module.exports.search = search;

/**
 * @return    The list of email addresses of users who are currently signed up to get email digests.
 */
const getDigestEmailAddresses = function() {
  return users.filter(user => user !== undefined && user.getNotificationPreferences().includes('email digest')).map(user => user.getEmailAddress());
}
module.exports.getDigestEmailAddresses = getDigestEmailAddresses;

// The user info object is a singleton.
module.exports = Object.freeze(module.exports);
