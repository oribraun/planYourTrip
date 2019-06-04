const express = require('express')
var router = express.Router();
var request = require('request');
const locations = require('./locations');
const countries = require('./countries');
const cities = require('./cities');
const hotels = require('./hotels');

router.get('/', (req, res) => res.send('Hello Router!'));
router.use('/locations', locations);
router.use('/countries', countries);
router.use('/cities', cities);
router.use('/hotels', hotels);

module.exports = router;