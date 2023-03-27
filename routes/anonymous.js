var express = require('express');
var passport = require('passport')
var router = express.Router();

/* GET home page. */
router.get('/',
  passport.authenticate(['anonymous'], { session: false }),
  function (req, res, next) {
    res.render('anonymous', { title: 'License Plates', anonymous: true });
  }
);

module.exports = router;
