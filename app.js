const express = require('express')
const app = express();
var router = express.Router();
const port = process.env.NODE_PORT || 3002;
const routing = require('./server/routing/index');

// app.get(/.*/, function(req, res) {}
app.get('/', (req, res) => res.send('Hello World!'))


var addToHeader = function (req, res, next) {
    // res.header("charset", "utf-8")
    var allowedOrigins = [];
    var origin = req.headers.origin;
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    if(allowedOrigins.indexOf(origin) > -1){
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Content-Type", "application/json");
    next();
};

app.use('/api', addToHeader, routing);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))