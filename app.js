var express = require('express');
var expressSession = require("express-session");
var passport = require('passport')
var Auth0Strategy = require("passport-auth0");
var AnonymousStrategy = require('passport-anonymous');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require("helmet");

require("dotenv").config();

var { Liquid } = require('liquidjs');

const engine = new Liquid({
  root: __dirname, // for layouts and partials
  extname: '.liquid',
  cache: process.env.NODE_ENV === 'production'
})

var indexRouter = require('./routes/index');
var anonymousRouter = require('./routes/anonymous');
var authRouter = require('./routes/auth');

var app = express();

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

const auth0Strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  }
);

app.use(helmet());

app.engine('liquid', engine.express());

app.set('views', ['./components', './views']);
app.set('view engine', 'liquid');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(expressSession(session));

passport.use(auth0Strategy);
passport.use(new AnonymousStrategy());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', anonymousRouter);

module.exports = app;
