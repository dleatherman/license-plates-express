var express = require('express');
var router = express.Router();
var states = require('../data/states.json');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'License Plates', states: states });
});

module.exports = router;
