var express = require('express');
var router = express.Router();

var Config = require('../config');
var config = new Config();

var request = require('request');
var urlencode = require('urlencode');

var query = "SELECT DISTINCT ?city ?coor ?range WHERE { ?city wdt:P31 wd:Q515. ?city ?range wd:Q40. ?city wdt:P625 ?coor. }";

request('https://query.wikidata.org/sparql?format=json&query=' + urlencode(query), function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("test" + config);
  res.render('index', { title: 'Express', ApiKey: config.googleMapsApiKey });
});

module.exports = router;
