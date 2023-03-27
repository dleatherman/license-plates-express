var express = require('express');
var passport = require('passport')
var AnonymousStrategy = require('passport-anonymous');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var { Liquid } = require('liquidjs');

const engine = new Liquid({
  root: __dirname, // for layouts and partials
  extname: '.liquid',
  cache: process.env.NODE_ENV === 'production'
})

var indexRouter = require('./routes/index');
var anonymousRouter = require('./routes/anonymous');

var app = express();

app.engine('liquid', engine.express());

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
passport.use(new AnonymousStrategy());
app.set('views', ['./components', './views']);
app.set('view engine', 'liquid');

app.use('/', indexRouter);
app.use('/anonymous', anonymousRouter);

module.exports = app;
