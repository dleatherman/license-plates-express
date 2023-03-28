var express = require('express');
var passport = require('passport')
var router = express.Router();

/* GET home page. */
router.post('/save',
  passport.authenticate(['auth0']),
  function (req, res, next) {
    res.redirect('/')
  });

module.exports = router;
