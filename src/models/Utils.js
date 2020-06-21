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

/**
 * @return  True iff inputString has a valid email address format.
 */
const isEmailAddress = function(inputString) {
  // regex taken from https://emailregex.com at 9:16 on Nov 13, 2019

  // eslint-disable-next-line
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(inputString);
}

/**
* @return  True iff inputString has a valid 5-digit zip code format.
*/
const isZipCode = function(inputString) {
  const regex = /^[0-9]{5}$/;
  return regex.test(inputString);
}

export default {
  encodeString: encodeString,
  isEmailAddress: isEmailAddress,
  isZipCode: isZipCode,
}
