const axios = require('axios');
const Location = require('./Location.js');

// for Google Places API
const API_KEY = 'AIzaSyDBw37QJoveJr7H_DeiAbJh3p3VGG2auAI';

// if user is not logged in, set default search area to Cambridge
const defaultLocation = Location.getCoordinatesFromZip('02139');

// cache results to reduce API calls
let cache = {}

/**
 * @typedef Restaurant
 * @prop {array} tags - restrictions/preferences that the restaurant satisfies
 * @prop {string} website - the restaurant's website
 */

/**
 * @class Restaurants
 * Retrieves restaurant data.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Restaurants {

    static locationString(location){
        return location.lat+ "," + location.lon;
    }

    /**
     * Load restaurants near a given coordinate/location.
     * @param {string} location - lat/lon coordinates to search near
     */
    static async loadRestaurants(location=defaultLocation) {
        let key = Restaurants.locationString(location);
        if (cache[key] && cache[key]['none']) {
            return cache[key]['none'];
        } else {
            const lat = location.lat;
            const lon = location.lon;
            let response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&type=restaurant&rankby=distance&key=${API_KEY}`)
            // maybe change this later to only include info we need
            let data = response.data.results;
            let promises = [];
            data.forEach(restaurant => {
                restaurant.tags = [];
                promises.push(axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=website&key=${API_KEY}`)
                .then(response => {
                    restaurant.website = response.data.result.website;
                    return restaurant.website;
                }));
            });
            promises = await Promise.all(promises);
            if (cache[key]) {
                cache[key]['none'] = data;
            } else {
                cache[key] = {'none': data};
            }
            return data;
        }
    }  

    /**
     * Load restaurants with a given restriction/preference and location
     * @param {*} criteria - dietary restriction/preference
     * @param {*} location - location to search in
     */
    static async loadWithCriteria(criteria, location, name) {
        let key = Restaurants.locationString(location);
        if (cache[key] && cache[key][criteria]) {
            return cache[key][criteria];
        } else {
            const lat = location.lat;
            const lon = location.lon;
            let response;
            if(name !== undefined){
                response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${name} ${criteria} restaurant&location=${lat},${lon}&key=${API_KEY}`);
            }else{
                response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${criteria} restaurant&location=${lat},${lon}&key=${API_KEY}`);
            }
            let data = response.data.results;
            let promises = [];
            data.forEach(restaurant => {
                restaurant.tags = [criteria];
                promises.push(axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=website&key=${API_KEY}`)
                .then(response => {
                    restaurant.website = response.data.result.website;
                    return restaurant.website;
                }));
            });
            promises = await Promise.all(promises);
            if (cache[key]) {
                cache[key][criteria] = data;
            } else {
                cache[key] = {criteria: data};
            }
            return data;
        }
    }

    /**
     * Load restaurants with a given max price range and location
     * @param {*} price - dietary restriction/preference
     * @param {*} location - location to search in
     */
    static async loadWithPrice(price, location, name) {
        let key = Restaurants.locationString(location);
        // if (cache[key] && cache[key][price]) {
        //     return cache[key][price];
        // } else {
            const lat = location.lat;
            const lon = location.lon;
            let response;
            if(name !== undefined){
                response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${name}&location=${lat},${lon}&maxprice=${price}&type=restaurant&rankby=distance&key=${API_KEY}`)
            }else{
                response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat},${lon}&maxprice=${price}&type=restaurant&rankby=distance&key=${API_KEY}`)
            }
            let data = response.data.results;
            let promises = [];
            data.forEach(restaurant => {
                restaurant.tags = [];
                promises.push(axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=website&key=${API_KEY}`)
                .then(response => {
                    restaurant.website = response.data.result.website;
                    return restaurant.website;
                }));
            });
            promises = await Promise.all(promises);
            if (cache[key]) {
                cache[key][price] = data;
            } else {
                cache[key] = {price: data};
            }
            return data;
        // }
    }

    /**
     * Load restaurants given a name
     * @param {*} name - of restaurant
     * @param {*} location - location to search in
     */
    static async loadName(name, location) {
        let key = Restaurants.locationString(location);
        if (cache[key] && cache[key][name]) {
            return cache[key][name];
        } else {
            const lat = location.lat;
            const lon = location.lon;
            let response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${name}&location=${lat},${lon}&type=restaurant&rankby=distance&key=${API_KEY}`)
            let data = response.data.results;
            let promises = [];
            data.forEach(restaurant => {
                restaurant.tags = [];
                promises.push(axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=website&key=${API_KEY}`)
                .then(response => {
                    restaurant.website = response.data.result.website;
                    return restaurant.website;
                }));
            });
            promises = await Promise.all(promises);
            if (cache[key]) {
                cache[key][name] = data;
            } else {
                cache[key] = {price: data};
            }
            return data;
        }
    }

    /**
     * Consolidate a list of restaurants such that duplicates
     * are removed and tags are combined to reflect the (optional) criteria
     * @param {Restaurant[]} restaurants - list of lists of restaurants to consolidate
     * @param {string[]} criteria - list of criteria that restaurants can be tagged with
     * @return a consolidated list of restaurants
     */
    static consolidate(restaurants, criteria=undefined) {
        let consolidated = [];
        let idToRestaurant = {};
        restaurants.forEach(list => {
            list.forEach(r => {
                if (!idToRestaurant[r.id]) {
                    idToRestaurant[r.id] = JSON.parse(JSON.stringify(r));
                }
                idToRestaurant[r.id].tags = [...new Set(
                    function*() { yield* idToRestaurant[r.id].tags; yield* r.tags; }()
                )];
                idToRestaurant[r.id].score = 0;
                if (criteria !== undefined) {
                    idToRestaurant[r.id].tags = idToRestaurant[r.id].tags.filter(tag => criteria.includes(tag));
                    idToRestaurant[r.id].score = criteria.filter(crit => idToRestaurant[r.id].tags.includes(crit)).length;
                }
                    // idToRestaurants[r.id].tags = [...idToRestaurants[r.id].tags];
            });
        });
        Object.keys(idToRestaurant).forEach(id => {
            consolidated.push(idToRestaurant[id]);
        });
        return consolidated;
    }

    // add method for consolidating lists of restaurants (remove duplicates, combines tags)
    // add method to show best results (by most tags satisfied?) for restrictions, look for
    // restaurants that satisfy the most restriction tags first
}

// const list1 = [{id: 1, tags: new Set()}];
// const list2 = [{id: 2, tags: new Set(['vegetarian', 'Mexican'])}];
// const restaurants = [list1, list2];


module.exports = Restaurants;