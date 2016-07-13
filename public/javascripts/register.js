 $(document).ready(function() {
  
   // register Button click
    $("#regBtn").click(function () {

        var userId = $("#LoginForm_email").val();
        var password = $("#LoginForm_password").val();
        var time = now();
        
        // check
        alert("to do check");
		// sent regist information
		$("form").submit();

    });

    // get current time
    function now() {
        var date = new Date();
        var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
        return time;
    }
 });
    
