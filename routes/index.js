var express = require('express');
var router = express.Router();

var _ = require('underscore');

var request = require('request');
var urlencode = require('urlencode');

var Config = require('../config');
var config = new Config();

var queryLimit = 100;

var GeoPoint = function(point){
  this.lat = null;
  this.long = null;
    if(point){
      var parts = point.split(" ");
      this.lat = parts[1].split(")")[0];
      this.long = parts[0].split("(")[1];
    }
}

var Results = function(bindings){
  this.bindings = bindings;
  this.results = [];

  this.add = function(){
    var result = bindings[Math.floor(Math.random() * (queryLimit - 1))];
    while (result == null || _.contains(this.results, result)){
      result = bindings[Math.floor(Math.random() * (queryLimit - 1))];
    }
    this.results.push(result);
    return result;
  }
}

//here comes the query
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
  "LIMIT 100";

/* GET home page. */
router.get('/', function(req, res, next) {

  var mountains = request('https://query.wikidata.org/sparql?format=json&query=' + urlencode(query), function (error, response, body) {
    if (!error && response.statusCode == 200) {


      var results = new Results(JSON.parse(body).results.bindings);
      var result = results.add();
      var miscMountain1 = results.add();
      var miscMountain2 = results.add();
      var miscMountain3 = results.add();

      console.log("Request done");
      var point = new GeoPoint(result.coord.value);

      res.render('index', {
        aw1: miscMountain1.label.value,
          aw2: miscMountain2.label.value,
          aw3: miscMountain3.label.value,
          name: result.label.value,
          coordinates: result.coord.value,
          image: result.picture.value,
          lat: point.lat,
          long: point.long
      });

      console.log(miscMountain1, miscMountain2, miscMountain3);
    }
    return false;
  })
});

module.exports = router;