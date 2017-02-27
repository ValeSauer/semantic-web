var express = require('express');
var router = express.Router();

var Config = require('../config');
var config = new Config();

var request = require('request');
var urlencode = require('urlencode');

var query = "SELECT ?subj ?label ?coord ?elev ?picture WHERE { " +
  "?subj wdt:P2044 ?elev. " +
  "?subj wdt:P625 ?coord. " +
  "?subj wdt:P17 wd:Q40. " +
  "?subj wdt:P18 ?picture. " +
  "SERVICE wikibase:label { " +
  "bd:serviceParam wikibase:language 'de'. " +
  "?subj rdfs:label ?label. " +
  "} " +
  "FILTER(?elev > 3000)  " +
  "}" +
  "ORDER BY RAND() " +
  "LIMIT 4"

request('https://query.wikidata.org/sparql?format=json&query=' + urlencode(query), function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
})

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("test" + config);
  res.render('index', { title: 'Express'});
});

module.exports = router;
