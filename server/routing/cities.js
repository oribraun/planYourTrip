const express = require('express')
var router = express.Router();
var request = require('request');
const fs = require('fs');

router.get('/', (req, res) => res.send('Hello World Cities!'));
router.get('/renew', (req, res) => {
    request('https://restcountries.eu/rest/v2/all', function (error, response, body) {
        var obj = {
            err:0,
            errMessage: ''
        };
        if(error) {
            obj.err = 1;
            obj.errMessage = error.stack
        }
        if(body) {
            obj.cities = JSON.parse(body);
        }
        fs.writeFile('./server/jsons/cities_by_country.json', JSON.stringify(obj.countries), (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;

            // success case, the file was saved
            console.log('countries saved!');
        });
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log(JSON.parse(body)); // Print the HTML for the Google homepage.
        res.json(obj);
    });
});
router.get('/get', (req, res) => {
    var obj = {
        err:0,
        errMessage: ''
    };
    let data = fs.readFileSync('./server/jsons/cities_by_country.json');
    if(data) {
        obj.cities = JSON.parse(data);
    } else {
        obj.err = 1;
        obj.errMessage = 'something went wrong'
    }
    res.json(obj);
});
module.exports = router;