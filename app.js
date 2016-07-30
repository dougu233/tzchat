
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('express-error-handler');
var debug = require('debug')('generated-express-app');
var routes = require('./routes/index');
//var routes = require('…/route/index');
global.USERS = {};
global.APP_PATH = __dirname;
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('routes', path.join(__dirname, 'routes'));
var MongoClient =require('mongodb').MongoClient;
var DBString='mongodb://localhost:27017/chat';

// all environments
app.set('port', process.env.PORT || 3000);
//app.use(express.favicon());
//app.use(express.logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
//app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

//var MongoClient =require('mongodb').MongoClient;
//var DBString='mongodb://localhost:27017/chat';


// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}


// online users' list 


app.use('/',routes);
/*
app.router('/')
  .get(function (req, res) {
    if (req.cookies.uid == null) {
      res.redirect('/login');
    } else {
      res.sendfile('views/index.html');
    }
  });

app.router('/login')
  .get(function (req, res) {
    res.sendfile('views/login.html');
  })
  .post(function (req, res) {
  if (users[req.body.uid]) {
    // uid is alive
    //##### TODO check from DB  #####//
    res.redirect('/login');
  } else {
    // save new uid in cookie 
    res.cookie("uid", req.body.name, {maxAge: 1000*60*60*24*30});
    res.redirect('/');
  }
});

app.router('/register')
  .get(function (req, res) {
  res.sendfile('views/register.html');
})
  .post(register.registerUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

  // online event
  socket.on('online', function (data) {
    // save uid as a socket object
    socket.name = data.uid;
    // if this uid is not in userlist,then save it  
    if (!global.USERS[data.uid]) {
      global.USERS[data.uid] = data.uid;
    }
    // broadcast online information to everyone
    io.sockets.emit('online', {users: global.USERS, user: data.uid});
  });

  // send message
  socket.on('say', function (data) {
    if (data.to == 'all') {
      // broadcast message
      socket.broadcast.emit('say', data);
    } else {
      // to someone in list
      var clients = io.sockets.clients();
      // find the user
      clients.forEach(function (client) {
        if (client.name == data.to) {
          // emit the event say
          client.emit('say', data);
        }
      });
    }
  });


  // offline event
  socket.on('disconnect', function() {
    // 
    if (global.USERS[socket.name]) {
      
      delete global.USERS[socket.name];
      // broadcast offline information to everyone
      socket.broadcast.emit('offline', {users: global.USERS, user: socket.name});
    }
  });
});
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;