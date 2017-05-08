var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/default');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var connect = require('connect-flash');
var config = require('./config/default');


var app = express();

app.use(session({
	name: 'myblog',// 设置 cookie 中保存 session id 的字段名称
	secret: 'myblog',// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	cookie: {maxAge: 18000000},// 过期时间，过期后 cookie 中的 session id 自动删除
	store:new MongoStore({url:config.mongodb}),//将session储存到mongodb中
	resave: false,
  rolling:true,//过期后 清除node session
	saveUninitialized: true
}));

app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
