var config =  require('./config');
var sohu = require('./libs/sohu');
var async = require('async');
var utils = require('./libs/utils');
var wget = require('./libs/wget');
var mp4box = require('./libs/mp4box');
var fs = require('fs');





var v = {};

init();
function init(){
	async.waterfall([
		// 读取要抓取的URLS
		function (callback) {
			fs.readFile('sohutv.txt', 'utf-8', function(err, data){
				if (err) {
		            console.log(err);
		            return;
		        }
		        if (!data) {
		        	console.log('sohutv.txt is empty!');
		        	return;
		        }
		        callback(null, data);
			});
		},
		function (args1, callback) {
			var urls = args1.split(/\n/);
			var ret = [];
			urls.forEach(function(val, index){
				if (val.indexOf('http')!==-1) {
					ret.push( val );
				}
			});
			callback(null, ret);
		},
		function (args1, callback) {
			var pageUrls = args1.slice(0);
			var loogRequest = function(urls){
				if (urls && urls.length===0) {
					callback(null);
					return;
				}
				var url = urls.shift();
				getVideo(url, function(){
					loogRequest(urls);
				});
			};
			loogRequest(pageUrls);
		}
	], function(err, result){

	});
}


function getVideo(pageUrl, cb){
	async.waterfall([
		// 从url页面抓取vid
		function (callback){
			sohu.getVidFromUrl(pageUrl, function(vid){
				if (!vid) {
					console.log('[ERROR] NOT FOUND VID!');
					cb();
					return;
				}
				callback(null, vid);
			});
		},

		// 通过vid抓取视频地址
		function (args1, callback) {
			sohu.getUrlsByVid(args1, function(vinfo) {
				if (!vinfo) {
					cb();
					return;
				}
				v.urls = vinfo.urls;
				v.title = vinfo.title;
				v.postfix = '.mp4';
				callback(null);
			});
		},

		// 新建目录 
		function (callback){
			var path = config.downloadPath + v.title + '\\';
	        v.path = path;
	        utils.mkdir(path, function () {
	        	callback(null);
	        });
		},

		// 依次下载
		function (callback){
			var urls = v.urls.slice(0);
			var pathnames = [];
			var index = 0;
			// console.log(urls);
			var singleName = urls.length === 1 ? v.title : null;
			var loopDownload = function (urls) {
				index += 1;
				if (urls.length===0) {
					callback(null, pathnames);
					return;
				};
				var url = urls.shift();
				var pathname = v.path + (singleName || index) + v.postfix;
				pathnames.push(pathname);
				// console.log(pathname);
				wget.download({
		        	url: url,
		        	pathname: pathname,
		        	cb: function () {
		        		console.log('[tips] 已完成:#' 
		        			+ v.title + '# [' 
		        			+ (index + '/' + v.urls.length + ']'));
		        		loopDownload(urls);
		        	}
		        });
			};
			var to = v.path + v.title + v.postfix;
			if (!fs.existsSync(to)) {
				loopDownload(urls);
			} else {
				cb();
			}
		},

		// 合并MP4
		function (args1, callback) {
			if (args1 & args1.length < 2 ) {
				cb();
				return;
			}
	    	var to = v.path + v.title + v.postfix;
	    	mp4box.concatMP4(args1, to, function (needDel){
	    		callback(null, args1, needDel);
	    	});
	    },

	    // 删除碎片
	    function (args1, args2, callback) {
	    	if (args2) {
				args1.forEach(function(val, index){
			        fs.unlinkSync(val);
			    });
	    	}
		    callback(null, 'ok');
	    }
	], function(err, result){
		cb();
	});
}