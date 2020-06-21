const express = require('express');

const Restaurants = require('../models/Restaurants');
const Location = require('../models/Location');

const router = express.Router();

/**
 * Search nearby restaurants by criteria, which can be any text query.
 * @name GET/api/restaurants/location/:zip/criteria/:criteria/:name
 * :zip is the zip code to search near
 * :criteria is the criteria to add
 * :name name of the restaurant user wants to find
 * @return {Restaurants} - the list of Restaurants that satisfy the criteria near the zip code
 * @throws {400} - if zip code is invalid
 */
router.get('/location/:zip/criteria/:criteria/:name', (req, res) => {
    let restaurants;
    let searchLocation = Location.getCoordinatesFromZip(req.params.zip);
    if (searchLocation === 'invalid zipcode') {
        res.status(400).json({
            error: `Invalid zip code.`
        }).end();
    } else {
        Restaurants.loadWithCriteria(req.params.criteria, searchLocation, req.params.name).then(response => {
            restaurants = response;
            res.status(200).json(
                restaurants
            ).end();
        });
    }
});

/**
 * Search nearby restaurants by criteria, which can be any text query.
 * @name GET/api/restaurants/location/:zip/criteria/:criteria
 * :zip is the zip code to search near
 * :criteria is the criteria to add
 * @return {Restaurants} - the list of Restaurants that satisfy the criteria near the zip code
 * @throws {400} - if zip code is invalid
 */
router.get('/location/:zip/criteria/:criteria', (req, res) => {
    let restaurants;
    let searchLocation = Location.getCoordinatesFromZip(req.params.zip);
    if (searchLocation === 'invalid zipcode') {
        res.status(400).json({
            error: `Invalid zip code.`
        }).end();
    } else {
        Restaurants.loadWithCriteria(req.params.criteria, searchLocation, undefined).then(response => {
            restaurants = response;
            res.status(200).json(
                restaurants
            ).end();
        });
    }
});

/**
 * Search nearby restaurants with max price range being price
 * @name GET/api/restaurants/location/:zip/price/:price
 * :zip is the zip code to search near
 * :price is the max price range
 * @return {Restaurants} - the list of Restaurants that satisfy the max price range
 * @throws {400} - if zip code is invalid
 */
router.get('/location/:zip/price/:price/:name', (req, res) => {
    let restaurants;
    let searchLocation = Location.getCoordinatesFromZip(req.params.zip);
    if (searchLocation === 'invalid zipcode') {
        res.status(400).json({
            error: `Invalid zip code.`
        }).end();
    } else {
        Restaurants.loadWithPrice(req.params.price, searchLocation, req.params.name).then(response => {
            restaurants = response;
            res.status(200).json(
                restaurants
            ).end();
        });
    }
});

/**
 * Search nearby restaurants with max price range being price
 * @name GET/api/restaurants/location/:zip/price/:price
 * :zip is the zip code to search near
 * :price is the max price range
 * @return {Restaurants} - the list of Restaurants that satisfy the max price range
 * @throws {400} - if zip code is invalid
 */
router.get('/location/:zip/price/:price', (req, res) => {
    let restaurants;
    let searchLocation = Location.getCoordinatesFromZip(req.params.zip);
    if (searchLocation === 'invalid zipcode') {
        res.status(400).json({
            error: `Invalid zip code.`
        }).end();
    } else {
        Restaurants.loadWithPrice(req.params.price, searchLocation).then(response => {
            restaurants = response;
            res.status(200).json(
                restaurants
            ).end();
        });
    }
});

/**
 * Search nearby restaurants that is called name
 * @name GET/api/restaurants/location/:zip/name/:name
 * :zip is the zip code to search near
 * :name is the name of restaurant we are looking for
 * @return {Restaurants} - the list of Restaurants that satisfy the name
 * @throws {400} - if zip code is invalid
 */
router.get('/location/:zip/name/:name', (req, res) => {
    let restaurants;
    let searchLocation = Location.getCoordinatesFromZip(req.params.zip);
    if (searchLocation === 'invalid zipcode') {
        res.status(400).json({
            error: `Invalid zip code.`
        }).end();
    } else {
        Restaurants.loadName(req.params.name, searchLocation).then(response => {
            restaurants = response;
            res.status(200).json(
                restaurants
            ).end();
        });
    }
});

/**
 * Search for restaurants in a certain zip code area
 * @name GET/api/restaurants/location/:zip
 * :zip is the zip code we are looking for restaurants in
 * @return {Restaurants} - the list of Restaurants from that zip code
 * @throws {400} - if zip code is invalid
 */
router.get('/location/:zip', (req, res) => {
    let restaurants;
    let searchLocation = Location.getCoordinatesFromZip(req.params.zip);
    if (searchLocation === 'invalid zipcode') {
        res.status(400).json({
            error: `Invalid zip code.`
        }).end();
    } else {
        Restaurants.loadRestaurants(searchLocation).then(response => {
            restaurants = response;
            res.status(200).json(
                restaurants
            ).end();
        });
    }
});

module.exports = router;
