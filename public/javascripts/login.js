  $(document).ready(function() {
  $("#say").click(function() {
    //获取要发送的信息
    var $msg = $("#input_content").html();
    if ($msg == "") return;
    //把发送的信息先添加到自己的浏览器 DOM 中
    if (to == "all") {
      $("#contents").append('<div>你(' + now() + ')对 所有人 说：<br/>' + $msg + '</div><br />');
    } else {
      $("#contents").append('<div style="color:#00f" >你(' + now() + ')对 ' + to + ' 说：<br/>' + $msg + '</div><br />');
    }
    //发送发话信息
    socket.emit('say', {from: from, to: to, msg: $msg});
    //清空输入框并获得焦点
    $("#input_content").html("").focus();
  })});