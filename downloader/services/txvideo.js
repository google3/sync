var async = require('async');
var qqlive = require('./../libs/qqlive');
var utils = require('./../libs/utils');
var conf = require('./../libs/config');
var fs = require('fs');
var dl = require('./download').dl;
var console = require('./../libs/Console');

var V = {};

function download(url, cb){
	async.waterfall([
		function(callback){
			V.postfix = '.mp4';
			if (conf.tenvideo.findHD==='true'){
				if (conf.tenvideo.vid){
					V.vid = conf.tenvideo.vid;
				}
				qqlive.findHdUrls(V.vid, function(data){
					// console.log(data);return;
					V.urls = data.urls;
					V.title = data.title;
					V.path = conf.download.path + V.title + '\\';
					callback(null);
				});
			}else {
				qqlive.getInfoByPlaypageurl(url, function(vinfo){
					if (vinfo.vid && vinfo.title) {
						console.info('[INFO][v.qq.com][vid='+vinfo.vid+']');
						console.info('[INFO][v.qq.com][title='+vinfo.title+']');
						V.vid = vinfo.vid;
						V.title = vinfo.title;
						V.path = conf.download.path + V.title + '\\';
						callback(null);
					}else{
						console.error('[ERROR][v.qq.com]can not get video infomation from play page url;');
						cb();
					}
				});
			}
		},
		function(callback){
			var pathname = V.path + V.title + V.postfix;
			if (fs.existsSync(pathname)){
        		console.warn('[TIPS][File Already Exist]:\n' + pathname);
        		cb();
        		return;
        	}
			utils.mkdir(V.path);
	        callback(null);
		},
		function(callback){
			if (conf.tenvideo.findHD==='true'){
				callback(null);
			} else{
				qqlive.getDownloadUrlByVid(V.vid, function (data) {
					if (data && data.vd && data.vd.vi && data.vd.vi.length) {
						V.urls = [{
							filename: V.title + V.postfix,
							url: data.vd.vi[0].url
						}];
						callback(null);
					}
				});
			}
			
		},
		function (args1, callback){
			var video = {
				urls: V.urls,
				filepath: V.path,
				title: V.title,
				postfix: V.postfix
			};
			// console.log(video);return;

			dl(video, function(){
				cb();
			});
		}
	], function(){

	});

}



exports.download = download;