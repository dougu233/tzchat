
exports.Register = function (data,db,todo,callback){
	switch (todo){
		case 'user':
			db.collection('user').insert(data,function(err,result){
			console.log(result);
			if(err)
			{
				console.log('Error:'+err);
				return;
			}
			callback(err);
			});
			break;
		default:
	}
}

// get current time
exports.GetTime = function () {
	var date = new Date();
	var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
	return time;
}