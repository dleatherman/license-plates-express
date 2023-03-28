var express = require('express');
var router = express.Router();
var passport = require('passport');
const querystring = require("querystring");

require("dotenv").config();

// auth.js

/**
 * Routes Definitions
 */

router.get(
  "/login",
  passport.authenticate(['auth0', 'anonymous'], {
    scope: "openid email profile", session: false
  }),
  (req, res) => {
    res.render('index', { title: 'License Plates' });
    res.redirect("/");
  }
);


router.get("/callback", (req, res, next) => {
  passport.authenticate("auth0", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/");
    });
  })(req, res, next);
});


router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
  });

  let returnTo = req.protocol + "://" + req.hostname;
  const port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo =
      process.env.NODE_ENV === "production"
        ? `${returnTo}/`
        : `${returnTo}:${port}/`;
  }

  const logoutURL = new URL(
    `https://${process.env.AUTH0_DOMAIN}/v2/logout`
  );

  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL || "/");
});

module.exports = router;