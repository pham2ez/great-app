/**
 * HTML-escape a string.
 *
 * @param inputString     the string to be HTML-escaped
 * @return                a string in which every character in inputString is HTML-escaped, excluding letters and digits
 */
const encodeString = function(inputString) {
  var result = '';
  inputString.split('').forEach((c) => {
    var id = c.charCodeAt();
    if (!(id >= 48 && id <= 57) && (id < 65 || id > 127 || (id > 90 && id < 97))) {
      result += ('&#' + id + ';');
    } else {
      result += c;
    }
  });
  return result;
}
module.exports.encodeString = encodeString;

const encodeAddress = function(address) {
  var result = '';
  const street = address.streetAddr;
  street.split(/\s/).forEach((token) => {
    result += token + '+';
  });
  const city = address.city;
  city.split(/\s/).forEach((token) => {
    result += token + '+';
  });
  return result.slice(0, -1);
}
module.exports.encodeAddress = encodeAddress;

/**
 * @return  True iff inputString has a valid email address format.
 */

const isEmailAddress = function(inputString) {
  // regex taken from https://emailregex.com at 9:16 on Nov 13, 2019
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(inputString);
}
module.exports.isEmailAddress = isEmailAddress;

/**
* @return  True iff inputString has a valid 5-digit zip code format.
*/
const isZipCode = function(inputString) {
  const regex = /^[0-9]{5}$/;
  return regex.test(inputString);
}
module.exports.isZipCode = isZipCode;

/**
 * Determine if two lists contain the same strings
 * @param {*} list1 - first list to compare
 * @param {*} list2 - other list to compare
 */
const containsSame = function(list1, list2) {
  if (list1.length !== list2.length) {
    return false;
  } else {
    for (let el of list1) {
      if (!list2.includes(el)) {
        return false;
      }
    }
    return true;
  }
}
module.exports.containsSame = containsSame;

// Utils is a singleton.
module.exports = Object.freeze(module.exports)
