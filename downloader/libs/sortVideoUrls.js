var fs = require('fs');

function getVideosUrls(cb){
	cb = cb || function(){};
	fs.readFile(__dirname + '/../conf/URLS.txt', 'utf-8', function(err, data){
		if (err) {
	        console.log(err);
	        return;
	    }
	    if (!data) {
	    	console.log('URLS.txt is empty!');
	    	return;
	    }
	    var Reg_urls = /\s*([^\n\r]+)\s*/g, match, urls=[];
	    while( (match = Reg_urls.exec(data)) != null) {
	    	if (match.length >= 2) {
	    		urls.push(match[1]);
	    	}
	    }
	    // console.log(urls);
	    cb(urls);
	});
}

exports.getVideosUrls = getVideosUrls;