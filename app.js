var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs'); // importar o hbs

var indexRouter = require('./routes/rotasIndex');
var usersRouter = require('./routes/rotasUsers');
var livrosRouter = require('./routes/rotasLivros');
var sobreRouter = require('./routes/rotasSobre');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registra partials do handlebars (view/partials)
hbs.registerPartials(path.join( __dirname, 'views', 'partials'));


// HELPER DO HANDLEBARS PARA COMPARAÇÕES NO HTML (IGUALDADE)
hbs.registerHelper('eq', function(a,b){
  return a === b;
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/livros', livrosRouter);
app.use('/sobre', sobreRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
