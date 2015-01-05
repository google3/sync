var wget = require('./wget');

function loopDownload(videoConf, cb){
	var videosConf = videoConf.urls.slice(0);
	// console.error(videosConf.length);return;
	var files = [], index = 0;
	var loop = function(_videosConf){
		if (_videosConf.length===0) {
			cb(files);
			return ;
		}
		var _videoConf = _videosConf.shift();
		var pathname = videoConf.filepath + (_videoConf.filename || (++index)+videoConf.postfix);
		files.push(pathname);
		wget.download({
	    	url: _videoConf.url || _videoConf,
	    	pathname: pathname,
	    	cb: function(){
	    		loop(_videosConf);
	    	}
	    });
	};
	loop(videosConf);
}

exports.loopDownload = loopDownload;