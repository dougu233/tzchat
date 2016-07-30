var express = require('express');
var router = express.Router();
var register = require(__dirname + '/register');




router.get('/',function (req, res) {
    if (req.cookies.uid == null) {
      res.redirect('/login');
    } else {
      res.sendFile(global.APP_PATH + '/views/index.html');
    }
  });

router.get('/login',function (req, res) {
    res.sendFile(global.APP_PATH + '/views/login.html');
  });

router.post('/login',function (req, res) {
  if (global.USERS[req.body.uid]) {
    // uid is alive
        //##### TODO check from DB  #####//
    console.log('unlogin');
    res.redirect('/login');
  } else {
    // save new uid in cookie 
    res.cookie('uid', req.body.uid, {maxAge: 1000*60*60*24*30});
    res.redirect('/');
  }
});

router.get('/register',function (req, res) {
  res.sendFile(global.APP_PATH + '/views/register.html');
});

router.post('/register',register.registerUser);

module.exports = router;