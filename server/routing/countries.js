const express = require('express')
var router = express.Router();
var request = require('request');
const fs = require('fs');
const csv = require('csv-parser');

router.get('/', (req, res) => res.send('Hello World Countries!'));
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
            obj.countries = JSON.parse(body);
        }
        fs.writeFile('./server/jsons/countries.json', JSON.stringify(obj.countries), (err) => {
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
    let data = fs.readFileSync('./server/jsons/countries.json');
    if(data) {
        obj.countries = JSON.parse(data);
    } else {
        obj.err = 1;
        obj.errMessage = 'something went wrong'
    }
    res.json(obj);
});

router.get('/read-from-csv', (req, res) => {
    let inputFilePath = './server/jsons/GeoLite2-City-Locations-en.csv';
    var countries = [];
    var countries_codes = [];
    var cities = [];
    fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', function(data){
            try {
                //perform the operation
                if(data.country_iso_code && countries_codes.indexOf(data.country_iso_code) === -1) {
                    countries_codes.push(data.country_iso_code);
                    countries.push({key: data.country_iso_code, name: data.country_name, continent_name: data.continent_name, continent_code: data.continent_code});
                }
                if(data.country_iso_code) {
                    cities.push({key: data.country_iso_code, city_name: data.city_name});
                }
            }
            catch(err) {
                //error handler
            }
        })
        .on('end',function(){
            //some final operation
            var cities_by_country = {};
            // console.log('countries', countries)
            fs.writeFile('./server/jsons/countries.json', JSON.stringify(countries, null, 4), (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                console.log('countries saved!');
            });
            for(let c in cities) {
                if(!cities_by_country[cities[c].key]) {
                    cities_by_country[cities[c].key] = [];
                }
                if(cities[c].city_name) {
                    cities_by_country[cities[c].key].push(cities[c].city_name);
                }
            }

            fs.writeFile('./server/jsons/cities_by_country.json', JSON.stringify(cities_by_country, null, 4), (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                console.log('cities saved!');
            });
            // console.log('cities', cities)
        });
})
module.exports = router;