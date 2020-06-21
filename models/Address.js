/**
 * An immutable class representing street addresses (no zip code).
 */
const Address = function(streetAddr, city, state) {
  var that = Object.create(Address.prototype);
  
  that.streetAddr = streetAddr === undefined ? '' : streetAddr;
  that.city = city  === undefined ? '' : city;
  that.state = state  === undefined ? '' : state;

  that.isEmpty = function() {
    return that.streetAddr === '' && that.city === '' && that.state === '';
  }
  
  // Addresses are immutable
  return Object.freeze(that);
}

// Make an Address by using:
// const Address = require(path/to/this/file);
// var myAddress = Address(streetAddr, city, state)
module.exports = Address;
