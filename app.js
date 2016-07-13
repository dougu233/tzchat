
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

var MongoClient =require('mongodb').MongoClient;
var DBString='mongodb://localhost:27017/chat';
var registerUser = function(data,db,callback){
	db.collection('user').insert(data,function(err,result){
        console.log(result);
		if(err)
		{
			console.log('Error:'+err);
			return;
		}
		callback(err);
	}
	);
};

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
app.get('/register', function (req, res) {
  res.sendfile('views/register.html');
});
app.post('/register', function (req, res) {
	
	 var userId = req.body.LoginForm_email;
	 console.log(userId);
     var password = req.body.LoginForm_password;
	 console.log(password);
     var time = now();
	 console.log(time);
	 var data =[{"userId": userId, "password": password, "last_login_time": time}];
	 console.log(data);
	 MongoClient.connect(DBString,data,function(err,db){
		   console.log("db connected");
		   registerUser(data,db,function(){
			   db.close();
		   })
        })
     console.log("register success");


    res.redirect('/login');
  }
);
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
    // get current time
 function now() {
        var date = new Date();
        var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
        return time;
    }
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
