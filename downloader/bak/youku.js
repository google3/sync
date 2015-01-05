var config =  require('./config');
var youku = require('./libs/youku');
var async = require('async');
var utils = require('./libs/utils');
var wget = require('./libs/wget');
var mp4box = require('./libs/mp4box');
var flv = require('./libs/concatFlv');
var fs = require('fs');


var v = {};



async.waterfall([
	function (callback) {
		fs.readFile('youku.txt', 'utf-8', function(err, data){
			if (err) {
	            console.log(err);
	            return;
	        }
	        if (!data) {
	        	console.log('youku.txt is empty!');
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
		urls.forEach(function(val, index){
			if (val.indexOf('http')!==-1) {
				vids.push( getVidFromPlayPage(val) );
			}
		});
		// console.log(vids);return;
		callback(null, vids);
	},
	function (args1, callback) {
		var vids = args1.slice(0);
		var loopDownload = function(varr){
			if (varr.length ===0) {
				callback(null);
				return;
			}
			var vid = varr.shift();
			download(vid, function(){
				loopDownload(varr);
			});
		};
		loopDownload(vids);
	}
], function(err, result){
	console.log('download finished!');
});

function getVidFromPlayPage(url){
    var VID_REG = /id_(\w+)\.html/;
    var ret = url.match(VID_REG);
    if (!ret || !ret.length) {
        console.log('url解析失败，确认url为视频播放页面');
    } else if (ret.length===2){
        return ret[1];
    } else {
        console.log('getVidFromPlayPage ERROR');
    }
}

function download(vid, cb){
	cb = cb || function (){};
	async.waterfall([
	    function (callback) {
	        youku.getVideoInfoByVID(vid, function(data){
				if (data && data.title) {
					v.title = utils.removeIllegalFolderChar(data.title);
					// console.log(v);return;
					callback(null);
				}
			});
	    },
	    function (callback) {
	        youku.getVideoList(vid, function(data){
	        	// console.log(data);return;
				if ( !(data && data.status==='success') ) {
					console.log('#获取下载地址失败#');
					return;
				}
				// console.log(data);return;
				var hasMp4 = data && data.results.mp4 && data.results.mp4.length;
				var hasFlv = data && data.results.flvhd && data.results.flvhd.length;
				var prefer = config.PreferredFormat.toUpperCase();
				if (hasMp4 && hasFlv && prefer==='MP4') {
					v.urls = data.results.mp4;
					v.postfix = '.mp4';
					callback(null);
					return;
				} else if (hasMp4 && hasFlv && prefer==='FLV') {
					v.urls = data.results.flvhd;
					v.postfix = '.flv';
					callback(null);
					return;
				}
				if (hasMp4) {
					v.urls = data.results.mp4;
					v.postfix = '.mp4';
					callback(null);
					return;
				} else if (hasFlv) {
					v.urls = data.results.flvhd;
					v.postfix = '.flv';
					callback(null);
					return;
				} else {
					console.log('[ERROR] 没有mp4或者flv的视频格式');
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
	    	if (v.postfix==='.mp4') {
	    		mp4box.concatMP4(args1, to, function (needDel){
		    		callback(null, args1, needDel);
		    	});
	    	} else if (v.postfix==='.flv') {
	    		flv.concatFlv(args1, to, function (needDel){
		    		callback(null, args1, needDel);
		    	});
	    	} else {
	    		cb();
	    	}
	    },
	    function (args1, args2, callback) {
	    	var cleanUp = config.cleanPart;
	    	if (args2 && cleanUp) {
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

