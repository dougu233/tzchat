var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var DBString ='mongodb://localhost:27017/chat';

exports.registerUser = function (req, res) {  
	var userId = req.body.LoginForm_email;
	console.log(userId);
    var password = req.body.LoginForm_password;
	console.log(password);
    var time = 0;
	console.log(time);
	var data =[{'userId': userId, 'password': password, 'last_login_time': time}];
	console.log(data);
    var commonF = require(global.APP_PATH + '/lib/commonFunction');
	MongoClient.connect(DBString,data,function(err,db){
	   console.log('db connected');
	   commonF.Register(data,db,'user',function(){
		   db.close();
	   })
    })
    console.log('register success');
	res.redirect('/login');
}


