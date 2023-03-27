var express = require('express');
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

var app = express();
app.engine('liquid', engine.express());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', ['./components', './views']);
app.set('view engine', 'liquid');

app.use('/', indexRouter);

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;
