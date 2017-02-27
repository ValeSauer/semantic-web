var express = require('express');
var router = express.Router();

var request = require('request');
var urlencode = require('urlencode');

var Config = require('../config');
var config = new Config();

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
  "LIMIT 10"

/* GET home page. */
router.get('/', function(req, res, next) {

  var mountains = request('https://query.wikidata.org/sparql?format=json&query=' + urlencode(query), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body).results.bindings[1];
      console.log("Request done");
      console.log(result);
      res.render('index', { name: result.label.value, coordinates: result.coord.value ,image: result.picture.value });
    }
    return false;
  })
});

module.exports = router;
