var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const requireAuth = require('./middlewares/requireAuth');

// importando o cookie-session
var cookieSession = require('cookie-session')

var indexRouter = require('./routes/index');


// importando rotas de autenticação
var authRouter = require('./routes/auth');

// importando rotas da api
var apiRouter = require('./routes/api');

var app = express();


// usando o cookie-session
app.use(cookieSession({
  name: 'pettopstore_session', // nome do cookie no navegador
  keys: ['chave_secreta_para_criptografia'], // chave necessária para criptografia
  maxAge: 24 * 60 * 60 * 1000 // 24 hours

}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// usando rotas da API
app.use('/api', apiRouter);

// usando rotas de autenticação
app.use('/auth', authRouter);

// aplica o requireAuth middleware na raiz do site
app.use('/', [requireAuth], indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
