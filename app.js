var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var items = require('./routes/items');
var auction = require('./routes/auction');
var user_model = require('./models/users');

var socket = require('./sockets');
socket.init();

var app = express();

var authenticationMiddleware = function(req, res, next) {
	var token = req.headers['authorization'];

	console.log('token ', token);

	if(token){
		console.log('request is authorized', req.user);
  		user_model.findUserByToken((rows) => {

			if(!rows.length) {
				res.status(403);
				res.send('{"forbidden": true}');

				return ;
			} else {
				req.user = rows[0];
			}
  			next();
  		}, token);

    	return ;
	} else {
        // This can be returned , it's just causing the browser log
        res.status(403);
		res.send('{"forbidden": true}');
		
        return ;
	}
	
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** Middlewares */
app.use('/items', authenticationMiddleware);
app.use('/auction', authenticationMiddleware);
app.use('/check-auth', authenticationMiddleware);
app.use('/users/logout', authenticationMiddleware);

app.use('/check-auth', function(req, res, next) {

	res.send(JSON.stringify(req.user));
});

/** Main routes */
app.use('/users', users);
app.use('/items', items);
app.use('/auction', auction);

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
