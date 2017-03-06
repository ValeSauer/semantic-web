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

        //create four random numbers for our four mountains
        var min = 1;
        var max = 100; //this has to be set to our query limit

        function rand (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        //create our four variables
        var g = rand(min, max); // this is the chosen one
        var o = rand(min, max); // John Doe #1
        var i = rand(min, max); // John Doe #2
        var l = rand(min, max); // John Doe #3

      var result = JSON.parse(body).results.bindings[g];
      var miscMountain1 = JSON.parse(body).results.bindings[o];
      var miscMountain2 = JSON.parse(body).results.bindings[i];
      var miscMountain3 = JSON.parse(body).results.bindings[l];
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