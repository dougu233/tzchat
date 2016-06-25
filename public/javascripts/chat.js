$(document).ready(function() {
  var socket = io.connect();
  var from = $.cookie('uid'); 
  var to = 'all'; // send to all
  // user online signal
  socket.emit('online', {user: from});
  socket.on('online', function (data) {

    // flush user list 
    flushUsers(data.users);
  });

  socket.on('say', function (data) {
    // send message to all
    if (data.to == 'all') {
      $("#contents").append('<div>' + data.from + '(' + now() + ')对 所有人 说：<br/>' + data.msg + '</div><br />');
    }
    // TODO
    // to only one
    //if (data.to == from) {

  });

  // refresh user list
  function flushUsers(users) {
    // clear old list
    $("#list").empty().append('<li title="双击聊天" alt="all" class="sayingto" onselectstart="return false">所有人</li>');
    // show new list
    for (var i in users) {
      $("#list").append('<li alt="' + users[i] + '" title="双击聊天" onselectstart="return false">' + users[i] + '</li>');
    }

  }


  // get current time
  function now() {
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
    return time;
  }

  // send message
  $("#say").click(function() {
    // 
    var msg = $("#input_content").html();
    if (msg == "") return;
    // save what you sent
    if (to == "all") {
      $("#contents").append('<div>你(' + now() + ')对 所有人 说：<br/>' + msg + '</div><br />');
    } else {
      // TODO
    }
    // sent message
    socket.emit('say', {from: from, to: to, msg: msg});
    // clear input area
    $("#input_content").html("").focus();
  });
});
