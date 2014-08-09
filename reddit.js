var http = require('http'),
    _ = require('underscore');

var url = 'http://www.reddit.com/r/all.json',
data = {},
lastRead;

var redditGetter = function(){
	http.get(url, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			redditData = JSON.parse(body);
			data = _.map(redditData.data.children, function(post){
				return _.pick(post.data, 'title', 'url');
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
	return data;
};