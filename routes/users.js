var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, /*mM1, mM2, mM3,*/ next) {
  res.send('respond with a resource');
  /*mM1.send('respond with a resource');
  mM2.send('respond with a resource');
  mM3.send('respond with a resource');*/
});

module.exports = router;
