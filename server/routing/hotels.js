const express = require('express')
var router = express.Router();
var request = require('request');

router.get('/', (req, res) => res.send('Hello World Hotels!'));
router.get('/get', (req, res) => {
    request('http://www.google.com', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        res.json(body);
    });
});
module.exports = router;