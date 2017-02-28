var express = require('express');
var router = express.Router();

var request = require('request');
var urlencode = require('urlencode');

var Config = require('../config');
var config = new Config();

var GeoPoint = function(point){
  this.lat = null;
  this.long = null;
    if(point){
      var parts = point.split(" ");
      this.lat = parts[1].split(")")[0];
      this.long = parts[0].split("(")[1];
    }
}

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
  "LIMIT 10";

/* GET home page. */
router.get('/', function(req, res, next) {

  var mountains = request('https://query.wikidata.org/sparql?format=json&query=' + urlencode(query), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body).results.bindings[1];
      console.log("Request done");
      var point = new GeoPoint(result.coord.value);
      res.render('index', { name: result.label.value, coordinates: result.coord.value ,image: result.picture.value, lat: point.lat, long: point.long });
    }
    return false;
  })
});

module.exports = router;
