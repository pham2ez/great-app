const axios = require('axios');
const API_KEY = 'AIzaSyDBw37QJoveJr7H_DeiAbJh3p3VGG2auAI';

const Address = require('./Address');
const Utils = require('./Utils');

let zipcode_data = require('../data/zipcodes.json');

// cache results to reduce API calls
let cache = {};

/**
 * @typedef Location
 * @prop {float} lat - latitude of location
 * @prop {float} lon - longitude of location
 */

/**
 * @class Location
 * Computes latitude and longitude given zipcode or address
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Location {
    /**
     * Get latitude and longitude of zipcode
     * @param {string} zipcode 
     */
    static getCoordinatesFromZip(zipcode) {
        if (zipcode_data['zipcodes'][zipcode]) {
            const lat_long = zipcode_data['zipcodes'][zipcode];
            const lat = lat_long[0];
            const lon = lat_long[1];
            return {lat, lon};
        } else {
            return 'invalid zipcode';
        }
    }

    /**
     * Get latitude and longitude of address
     * @param {Address} address
     */
    static async getCoordinatesFromAddress(address) {
        if (cache[address]) {
            return cache[address];
        } else {
            const encodedAddress = Utils.encodeAddress(address);
            let response = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodedAddress}&inputtype=textquery&fields=geometry&key=${API_KEY}`);
            if (response.data.candidates) {
                response = response.data.candidates[0];
                const lat = response.geometry.location.lat;
                const lon = response.geometry.location.lng;
                cache[address] = {lat, lon};
                console.log('nearest location');
                console.log({lat, lon});
                return {lat, lon};
            } else {
                return 'invalid address';
            }
        }
    }

    /**
     * Get the latitude and longitude of the average location between a list of lat/lon
     * @param {Object[]} locations
     * 
     * Algorithm from https://gist.github.com/tlhunter/0ea604b77775b3e7d7d25ea0f70a23eb
     */
    static getAverageLocation(locations) {        
        let x = 0.0;
        let y = 0.0;
        let z = 0.0;
        
        for (let location of locations) {
            let latitude = location.lat * Math.PI / 180;
            let longitude = location.lon * Math.PI / 180;
        
            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
        }
        
        let total = locations.length;
        
        x = x / total;
        y = y / total;
        z = z / total;
        
        let centralLongitude = Math.atan2(y, x);
        let centralSquareRoot = Math.sqrt(x * x + y * y);
        let centralLatitude = Math.atan2(z, centralSquareRoot);
        
        return {
            lat: centralLatitude * 180 / Math.PI,
            lon: centralLongitude * 180 / Math.PI
        };
    }
}

// expect ~ 37.790831, -122.407169
// const sf = [{
//     lat: 37.797749,
//     lon: -122.412147
//   }, {
//     lat: 37.789068,
//     lon: -122.390604
//   }, {
//     lat: 37.785269,
//     lon: -122.421975
//   }];
  
// console.log(Location.getAverageLocation(sf));

// Location.getCoordinatesFromAddress(Address('229 Vassar Street', 'Cambridge', 'MA')).then(response => {
//     console.log(response);
// });
module.exports = Location;