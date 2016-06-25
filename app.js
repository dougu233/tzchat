
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// online users' list 
var users = {};

app.get('/', function (req, res) {
  if (req.cookies.uid == null) {
    res.redirect('/login');
  } else {
    res.sendfile('views/index.html');
  }
});
app.get('/login', function (req, res) {
  res.sendfile('views/login.html');
});
app.post('/login', function (req, res) {
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

var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

  // online event
  socket.on('online', function (data) {
    // save uid as a socket object
    socket.name = data.uid;
    // if this uid is not in userlist,then save it  
    if (!users[data.uid]) {
      users[data.uid] = data.uid;
    }
    // broadcast online information to everyone
    io.sockets.emit('online', {users: users, user: data.uid});
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
    if (users[socket.name]) {
      
      delete users[socket.name];
      // broadcast offline information to everyone
      socket.broadcast.emit('offline', {users: users, user: socket.name});
    }
  });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
