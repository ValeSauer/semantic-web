var express = require('express');
var router = express.Router();

var Config = require('../config');
var config = new Config();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("test" + config);
  res.render('index', { title: 'Express', ApiKey: config.googleMapsApiKey });
});

module.exports = router;
