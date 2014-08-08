var http = require('http');

var url = 'http://www.reddit.com/r/all.json',
redditTitles = '',
lastRead;

var redditGetter = function(){
	http.get(url, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			redditData = JSON.parse(body);
			redditTitles = '';
			redditData.data.children.forEach(function(post){
				if(post.data.title){
					redditTitles += post.data.title + ' ';
				}
			});
			lastRead = new Date();
		});
	}).on('error', function(e) {
		console.log("Got error: ", e);
	});
};

redditGetter();

exports.get = function(){
	if( Math.abs(new Date() - lastRead) >= 300000 ) redditGetter();
	return redditTitles;
};