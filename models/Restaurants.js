const axios = require('axios');
const Location = require('./Location.js');
const Config = require('./config.js');

// for Google Places API
const API_KEY = Config.getAPIKey();

// if user is not logged in, set default search area to Cambridge
const defaultLocation = Location.getCoordinatesFromZip('02139');

// cache results to reduce API calls
let cache = {'02139':[
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Rangzen Tibetan Place',
      opening_hours: { open_now: false },
      photos: [ [Object] ],
      place_id: 'ChIJVxZ8HVR344kRTTbait6B334',
      plus_code: {
        compound_code: '9V7W+MQ Cambridge, MA, USA',
        global_code: '87JC9V7W+MQ'
      },
      price_level: 2,
      rating: 4.5,
      reference: 'ChIJVxZ8HVR344kRTTbait6B334',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 378,
      vicinity: '24 Pearl Street, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: "Pepper Sky's",
      opening_hours: { open_now: true },
      photos: [ [Object] ],
      place_id: 'ChIJT16gA1R344kRorMxvex8oj8',
      plus_code: {
        compound_code: '9V7W+MR Cambridge, MA, USA',
        global_code: '87JC9V7W+MR'
      },
      price_level: 2,
      rating: 4.3,
      reference: 'ChIJT16gA1R344kRorMxvex8oj8',
      scope: 'GOOGLE',
      types: [
        'meal_delivery',
        'restaurant',
        'food',
        'point_of_interest',
        'establishment'
      ],
      user_ratings_total: 339,
      vicinity: '20 Pearl Street, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Brookline Lunch',
      opening_hours: { open_now: false },
      photos: [ [Object] ],
      place_id: 'ChIJiW64bFR344kRrmHIUt9jtgY',
      plus_code: {
        compound_code: '9V7X+G8 Cambridge, MA, USA',
        global_code: '87JC9V7X+G8'
      },
      price_level: 1,
      rating: 4.5,
      reference: 'ChIJiW64bFR344kRrmHIUt9jtgY',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 390,
      vicinity: '9 Brookline Street, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'The Mad Monkfish',
      opening_hours: { open_now: true },
      photos: [ [Object] ],
      place_id: 'ChIJ837FC1R344kRVlYqVsoSQew',
      plus_code: {
        compound_code: '9V7X+M4 Cambridge, MA, USA',
        global_code: '87JC9V7X+M4'
      },
      price_level: 2,
      rating: 4.4,
      reference: 'ChIJ837FC1R344kRVlYqVsoSQew',
      scope: 'GOOGLE',
      types: [
        'night_club',
        'bar',
        'restaurant',
        'food',
        'point_of_interest',
        'establishment'
      ],
      user_ratings_total: 1458,
      vicinity: '524 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Middle East Restaurant and Club',
      opening_hours: { open_now: false },
      photos: [ [Object] ],
      place_id: 'ChIJTxLlbVR344kRmTrohl7Eo94',
      plus_code: {
        compound_code: '9V7X+F9 Cambridge, MA, USA',
        global_code: '87JC9V7X+F9'
      },
      price_level: 2,
      rating: 4.3,
      reference: 'ChIJTxLlbVR344kRmTrohl7Eo94',
      scope: 'GOOGLE',
      types: [
        'night_club',
        'bar',
        'restaurant',
        'food',
        'point_of_interest',
        'establishment'
      ],
      user_ratings_total: 1480,
      vicinity: '472-480 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Viale',
      opening_hours: { open_now: false },
      photos: [ [Object] ],
      place_id: 'ChIJ2c38DFR344kRDh6Brkv0A5o',
      plus_code: {
        compound_code: '9V7X+J7 Cambridge, MA, USA',
        global_code: '87JC9V7X+J7'
      },
      price_level: 2,
      rating: 4.5,
      reference: 'ChIJ2c38DFR344kRDh6Brkv0A5o',
      scope: 'GOOGLE',
      types: [
        'bar',
        'restaurant',
        'food',
        'point_of_interest',
        'establishment'
      ],
      user_ratings_total: 423,
      vicinity: '502 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png',
      name: 'The Phoenix Landing',
      opening_hours: { open_now: true },
      photos: [ [Object] ],
      place_id: 'ChIJwZlVC1R344kRFd80FfZkL_4',
      plus_code: {
        compound_code: '9V7X+J6 Cambridge, MA, USA',
        global_code: '87JC9V7X+J6'
      },
      price_level: 2,
      rating: 4.3,
      reference: 'ChIJwZlVC1R344kRFd80FfZkL_4',
      scope: 'GOOGLE',
      types: [
        'bar',
        'night_club',
        'restaurant',
        'food',
        'point_of_interest',
        'establishment'
      ],
      user_ratings_total: 652,
      vicinity: '512 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Five Spices House',
      opening_hours: { open_now: true },
      photos: [ [Object] ],
      place_id: 'ChIJxVSOzfd344kR1jlxoNiN3Bk',
      plus_code: {
        compound_code: '9V7X+P3 Cambridge, MA, USA',
        global_code: '87JC9V7X+P3'
      },
      rating: 4.5,
      reference: 'ChIJxVSOzfd344kR1jlxoNiN3Bk',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 190,
      vicinity: '546 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'One World Cuisine',
      opening_hours: { open_now: false },
      place_id: 'ChIJychDnw9644kRE_1B058BBMY',
      plus_code: {
        compound_code: '9V7X+Q2 Cambridge, MA, USA',
        global_code: '87JC9V7X+Q2'
      },
      rating: 3.3,
      reference: 'ChIJychDnw9644kRE_1B058BBMY',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 3,
      vicinity: '552 Massachusetts Avenue #204, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Clover Food Lab',
      opening_hours: { open_now: false },
      photos: [ [Object] ],
      place_id: 'ChIJ362dc1R344kRqHTdolOZgS0',
      plus_code: {
        compound_code: '9V7X+H9 Cambridge, MA, USA',
        global_code: '87JC9V7X+H9'
      },
      price_level: 1,
      rating: 4.4,
      reference: 'ChIJ362dc1R344kRqHTdolOZgS0',
      scope: 'GOOGLE',
      types: [
        'cafe',
        'restaurant',
        'food',
        'point_of_interest',
        'store',
        'establishment'
      ],
      user_ratings_total: 812,
      vicinity: '496 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Zuzu',
      opening_hours: { open_now: true },
      photos: [ [Object] ],
      place_id: 'ChIJH9cEblR344kR4_5hOythj0k',
      plus_code: {
        compound_code: '9V7X+GC Cambridge, MA, USA',
        global_code: '87JC9V7X+GC'
      },
      price_level: 2,
      rating: 4.2,
      reference: 'ChIJH9cEblR344kR4_5hOythj0k',
      scope: 'GOOGLE',
      types: [
        'night_club',
        'bar',
        'restaurant',
        'food',
        'point_of_interest',
        'establishment'
      ],
      user_ratings_total: 259,
      vicinity: '474 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'CLOSED_TEMPORARILY',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Green Street',
      permanently_closed: true,
      photos: [ [Object] ],
      place_id: 'ChIJf9z3sVZ344kR5yI0eABZKJA',
      plus_code: {
        compound_code: '9V7W+R8 Cambridge, MA, USA',
        global_code: '87JC9V7W+R8'
      },
      price_level: 2,
      rating: 4.4,
      reference: 'ChIJf9z3sVZ344kR5yI0eABZKJA',
      scope: 'GOOGLE',
      types: [
        'bar',
        'restaurant',
        'food',
        'point_of_interest',
        'establishment'
      ],
      user_ratings_total: 515,
      vicinity: '280 Green Street, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Mary Chung Restaurant',
      opening_hours: { open_now: true },
      photos: [ [Object] ],
      place_id: 'ChIJTQbbb1R344kRDV69bt872jM',
      plus_code: {
        compound_code: '9V7X+FG Cambridge, MA, USA',
        global_code: '87JC9V7X+FG'
      },
      price_level: 1,
      rating: 4.1,
      reference: 'ChIJTQbbb1R344kRDV69bt872jM',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 427,
      vicinity: '464 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Veggie Galaxy',
      opening_hours: { open_now: false },
      photos: [ [Object] ],
      place_id: 'ChIJJ5JOZVR344kRd62Nb9Yo06s',
      plus_code: {
        compound_code: '9V7X+FH Cambridge, MA, USA',
        global_code: '87JC9V7X+FH'
      },
      price_level: 2,
      rating: 4.6,
      reference: 'ChIJJ5JOZVR344kRd62Nb9Yo06s',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 2805,
      vicinity: '450 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'La Fabrica Central',
      opening_hours: { open_now: false },
      photos: [ [Object] ],
      place_id: 'ChIJO1wSaVR344kRgXMAOEahAwc',
      plus_code: {
        compound_code: '9V7X+CH Cambridge, MA, USA',
        global_code: '87JC9V7X+CH'
      },
      price_level: 2,
      rating: 4.2,
      reference: 'ChIJO1wSaVR344kRgXMAOEahAwc',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 771,
      vicinity: '450 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Chipotle Mexican Grill',
      opening_hours: { open_now: true },
      photos: [ [Object] ],
      place_id: 'ChIJ3VhH_lN344kR0tMHgQfyZjQ',
      plus_code: {
        compound_code: '9V7W+WM Cambridge, MA, USA',
        global_code: '87JC9V7W+WM'
      },
      price_level: 1,
      rating: 4,
      reference: 'ChIJ3VhH_lN344kR0tMHgQfyZjQ',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 351,
      vicinity: '598 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'CLOSED_TEMPORARILY',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Little Donkey',
      permanently_closed: true,
      photos: [ [Object] ],
      place_id: 'ChIJGTS3dVR344kRy3uxf6fp5CE',
      plus_code: {
        compound_code: '9V7X+P9 Cambridge, MA, USA',
        global_code: '87JC9V7X+P9'
      },
      price_level: 2,
      rating: 4.5,
      reference: 'ChIJGTS3dVR344kRy3uxf6fp5CE',
      scope: 'GOOGLE',
      types: [
        'restaurant',
        'bar',
        'food',
        'point_of_interest',
        'establishment'
      ],
      user_ratings_total: 1556,
      vicinity: '505 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'CLOSED_TEMPORARILY',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Happy Lamb',
      permanently_closed: true,
      photos: [ [Object] ],
      place_id: 'ChIJ3dESd1R344kRRbxnm9bFoZ8',
      plus_code: {
        compound_code: '9V7X+MF Cambridge, MA, USA',
        global_code: '87JC9V7X+MF'
      },
      price_level: 2,
      rating: 4.5,
      reference: 'ChIJ3dESd1R344kRRbxnm9bFoZ8',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 759,
      vicinity: '485 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
      name: 'Mariposa Bakery',
      opening_hours: { open_now: false },
      photos: [ [Object] ],
      place_id: 'ChIJfevwY1R344kR7fSF3hTUsY8',
      plus_code: {
        compound_code: '9V7X+8P Cambridge, MA, USA',
        global_code: '87JC9V7X+8P'
      },
      price_level: 2,
      rating: 4,
      reference: 'ChIJfevwY1R344kR7fSF3hTUsY8',
      scope: 'GOOGLE',
      types: [ 'restaurant', 'food', 'point_of_interest', 'establishment' ],
      user_ratings_total: 239,
      vicinity: '424 Massachusetts Avenue, Cambridge'
    },
    {
      business_status: 'OPERATIONAL',
      geometry: { location: [Object], viewport: [Object] },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
      name: "Dunkin'",
      opening_hours: { open_now: true },
      photos: [ [Object] ],
      place_id: 'ChIJY_VDjhV644kRv959J5O02Ac',
      plus_code: {
        compound_code: '9V7W+XJ Cambridge, MA, USA',
        global_code: '87JC9V7W+XJ'
      },
      price_level: 1,
      rating: 3.4,
      reference: 'ChIJY_VDjhV644kRv959J5O02Ac',
      scope: 'GOOGLE',
      types: [
        'bakery',
        'meal_takeaway',
        'cafe',
        'restaurant',
        'food',
        'point_of_interest',
        'store',
        'establishment'
      ],
      user_ratings_total: 219,
      vicinity: '616 Massachusetts Avenue, Cambridge'
    }
  ]};

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
        cache['02139'].forEach(restaurant => {
            restaurant.tags = [];
        });
        return cache['02139'];
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
        cache['02139'].forEach(restaurant => {
            restaurant.tags = [];
        });
        return cache['02139'];
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
        cache['02139'].forEach(restaurant => {
            restaurant.tags = [];
        });
        return cache['02139'];
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
        cache['02139'].forEach(restaurant => {
            restaurant.tags = [];
        });
        return cache['02139'];
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
                if (!idToRestaurant[r.place_id]) {
                    idToRestaurant[r.place_id] = JSON.parse(JSON.stringify(r));
                }
                idToRestaurant[r.place_id].tags = [...new Set(
                    function*() { yield* idToRestaurant[r.place_id].tags; yield* r.tags; }()
                )];
                idToRestaurant[r.place_id].score = 0;
                if (criteria !== undefined) {
                    idToRestaurant[r.place_id].tags = idToRestaurant[r.place_id].tags.filter(tag => criteria.includes(tag));
                    idToRestaurant[r.place_id].score = criteria.filter(crit => idToRestaurant[r.place_id].tags.includes(crit)).length;
                }
                    // idToRestaurants[r.place_id].tags = [...idToRestaurants[r.place_id].tags];
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