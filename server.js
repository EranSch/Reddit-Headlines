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

var requestHandler = function(req, res){

	//Refresh reddit data if more than 5 minutes old
	if( Math.abs(new Date() - lastRead) >= 300000 ) redditGetter();

	res.writeHead(200);
	res.write('\n<!-- Wow you looked under the hook, I\'m flattered! Curious?         --\n');
	res.write(  '  -- The backend for this silly thing is written in NodeJS. Check   --\n');
	res.write(  '  -- it out here: https://github.com/Swingline0/Reddit-Headlines    -->\n\n');
	res.write('<html><head><meta charset="utf-8" />');
	res.write('<style type="text/css">html,body{width:100vw;height:100vh;margin:0;padding:0}h1,footer{font-family:helvetica, arial;color: rgb(241, 241, 241);max-width: 350px;;margin:1em auto;padding:0}p{font-family:helvetica, arial;display:block;max-width: 350px;;margin:0 auto;padding:0}p {opacity:0;transition-duration:3s}p.loaded {opacity:1}.blast-root .blast:nth-of-type(2n) {color: rgb(233, 109, 109);}.blast {color: rgb(255, 255, 255);transition-duration:10s}.loaded .blast {color: rgb(201, 201, 201);}footer{text-align:center;}footer a{color: rgb(141, 141, 141);text-decoration: none;}.slabtexted .slabtext{display:-moz-inline-box;display:inline-block;white-space:nowrap;}.slabtextinactive .slabtext{display:inline;white-space:normal;font-size:1em !important;letter-spacing:inherit !important;word-spacing:inherit !important;*letter-spacing:0 !important;*word-spacing:0 !important;}.slabtextdone .slabtext{display:block;}</style>');
	res.write('</head><body>');
	res.write('<h1>reddit headlines</h1>');
	res.write('<p>' + redditTitles + '</p>');
	res.write('<footer>made with loving procrastination by <a href="http://eran.sh" target="_blank">eran</a></footer>');
	res.write('</body>');
	res.write('<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>');
	res.write('<script src="http://merlin.eran.sh/stuff/jquery.slabtext.min.js"></script>');
	res.write('<script src="http://merlin.eran.sh/stuff/jquery.blast.min.js"></script>');
	res.write('<script src="http://merlin.eran.sh/stuff/blast-demo.js"></script>');
	res.end('</html>');
};

var server = http.createServer(requestHandler);

var port = process.env.PORT || 9090;
server.listen(port, function(err){
	if (err) throw err;
	console.dir('Listening for connections on port ' + port);
});