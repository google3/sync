var config =  require('./config');
var async = require('async');
var utils = require('./libs/utils');
var wget = require('./libs/wget');
var qqlive = require('./libs/qqlive');
var fs = require('fs');

var v = {};



async.waterfall([
	function (callback) {
		fs.readFile('qqlive.txt', 'utf-8', function(err, data){
			if (err) {
	            console.log(err);
	            return;
	        }
	        if (!data) {
	        	console.log('qqlive.txt is empty!');
	        	return;
	        }
	        callback(null, data);
		});
	},
	function (args1, callback) {
		// var vid = getVidFromPlayPage();
		// callback(null, vid);
		var urls = args1.split(/\n/);
		var vids = [];
		qqlive.getInfoByPlaypageurl(urls[0], function(vinfo){
			if (vinfo.vid && vinfo.title) {
				v.vid = vinfo.vid;
				v.title = vinfo.title;
				v.postfix = '.mp4';
				callback(null);
			}
		});
		// callback(null, vids);
	},
	function (callback) {
        var path = config.downloadPath + v.title + '\\';
        v.path = path;
        utils.mkdir(path, function () {
        	callback(null);
        });
    },
	function (callback) {
		qqlive.getDownloadUrlByVid(v.vid, function (data) {
			if (data && data.vd && data.vd.vi && data.vd.vi.length) {
				callback(null, data.vd.vi[0].url);
			}
		});
	},
	function (args1, callback) {
		var pathname = v.path + v.title + v.postfix;
		wget.download({
        	url: args1,
        	pathname: pathname,
        	cb: function () {
        	}
        });
		// var vids = args1.slice(0);
		// var loopDownload = function(varr){
		// 	if (varr.length ===0) {
		// 		callback(null);
		// 		return;
		// 	}
		// 	var vid = varr.shift();
		// 	download(vid, function(){
		// 		loopDownload(varr);
		// 	});
		// };
		// loopDownload(vids);
	}
], function(err, result){
	console.log('download finished!');
});

function download(vid, cb){
	cb = cb || function (){};
	async.waterfall([
	    function (callback) {
	        youku.getVideoInfoByVID(vid, function(data){
				if (data && data.title) {
					v.title = utils.removeIllegalFolderChar(data.title);
					callback(null);
				}
			});
	    },
	    function (callback) {
	        youku.getVideoList(vid, function(data){
				if ( !(data && data.status==='success') ) {
					console.log('#获取下载地址失败#');
					return;
				}
				if (data && data.results.mp4 && data.results.mp4.length) {
					v.urls = data.results.mp4;
					v.postfix = '.mp4';
					callback(null);
				}
			});
	    },
	    function (callback) {
	        var path = config.downloadPath + v.title + '\\';
	        v.path = path;
	        utils.mkdir(path, function () {
	        	callback(null, path);
	        });
	    },
	    function (args1, callback) {
	    	var urls = v.urls.slice(0);
	    	var paths = [];
	    	var loopDownload = function (urls) {
	    		if (urls.length===0) {
	    			callback(null, paths);
	    			return;
	    		}
	    		var vObj = urls.shift();
	    		var pathname = args1 + vObj.id + v.postfix;
	    		paths.push(pathname);
	    		wget.download({
		        	url: vObj.url,
		        	pathname: pathname,
		        	cb: function () {
		        		console.log('[tips]: ' + v.title + ' 已完成[' + paths.length + '/' + (urls.length+paths.length) + ']');
		        		loopDownload(urls);
		        	}
		        });
	    	};
	    	loopDownload(urls);
	    },
	    function (args1, callback) {
	    	var to = v.path + v.title + v.postfix;
	    	mp4box.concatMP4(args1, to, function (needDel){
	    		callback(null, args1, needDel);
	    	});
	    },
	    function (args1, args2, callback) {
	    	if (args2) {
				args1.forEach(function(val, index){
			        fs.unlinkSync(val);
			    });
	    	}
		    callback(null, 'ok');
	    }
	], function (err, result) {
		console.log('[task finished]: ' + v.title);
		cb();
	});
}

