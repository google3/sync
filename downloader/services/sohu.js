var async = require('async');
var sohu = require('./../libs/sohu');
var utils = require('./../libs/utils');
var conf = require('./../libs/config');
var fs = require('fs');
var dl = require('./download').dl;
var console = require('./../libs/Console');


var V = {};
function download(url, cb){
	async.waterfall([

		// 从url页面抓取vid
		function(callback){
			sohu.getVidFromUrl(url, function(vid){
				if (!vid) {
					console.error('[ERROR][tv.sohu.com]fail to get vid');
					cb();
					return;
				}
				V.vid = vid;
				console.info('[INFO][tv.sohu.com][vid='+vid+']');
				callback(null);
			});
		},

		// 通过vid抓取视频地址
		function (callback) {
			sohu.getUrlsByVid(V.vid, function(vinfo) {
				if (!vinfo) {
					cb();
					return;
				}
				V.urls = vinfo.urls;
				V.title = vinfo.title;
				V.postfix = '.mp4';
				console.info('[INFO][tv.sohu.com][title='+vinfo.title+']');
				var path = conf.download.path + V.title + '\\';
	        	V.path = path;
				callback(null);
			});
		},

		function (callback){
			var pathname = V.path + V.title + V.postfix;
			if (fs.existsSync(pathname)){
        		console.warn('[TIPS][File Already Exist]:\n' + pathname);
        		cb();
        		return;
        	}
			utils.mkdir(V.path, function () {
	        	callback(null);
	        });
		},
		function (callback) {
			var urls = V.urls.slice(0);
			var tmp = [];
			if (urls.length===1) {
				tmp.push({
					filename: V.title + V.postfix,
					url: urls[0]
				});
			}else {
				urls.forEach(function(val ,index){
					tmp.push({
						filename: (index+1) + V.postfix,
						url: val
					});
				});
			}
			V.urls = tmp;
			callback(null)
		},
		function(callback) {
			var video = {
				urls: V.urls,
				filepath: V.path,
				title: V.title,
				postfix: V.postfix
			};

			dl(video, function(){
				cb()
			});
		}
	], function(){});
	
	
}


exports.download = download;