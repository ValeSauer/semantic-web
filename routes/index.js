var express = require('express');
var router = express.Router();

var SparqlClient = require('sparql-client-2');

var Config = require('../config');
var config = new Config();

//var endpoint = 'https://query.wikidata.org/sparql?query=SPARQL';

// Get the leaderName(s) of the 10 cities
var query = "SELECT * FROM <http://dbpedia.org> WHERE { " +
  "?city <http://dbpedia.org/property/leaderName> ?leaderName " +
  "} LIMIT 10";
var client = new SparqlClient( 'http://dbpedia.org/sparql')
  .register({db: 'http://dbpedia.org/resource/'});

client.query(query)
  .bind('city', {db: 'Vienna'})
  .execute(function(error, results) {
    console.dir(arguments, {depth: null});
  });

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("test" + config);
  res.render('index', { title: 'Express', ApiKey: config.googleMapsApiKey });
});

module.exports = router;
