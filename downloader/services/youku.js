var async = require('async');
var youku = require('./../libs/youku');
var utils = require('./../libs/utils');
var conf = require('./../libs/config');
var fs = require('fs');
var dl = require('./download').dl;
var console = require('./../libs/Console');

var V = {};
function download(url, cb){
	async.waterfall([
		function(callback){
			var vid = getVidFromPlayPage(url);
			V.vid = vid;
			if (!vid) {
				console.error('[ERROR][v.youku.com]');
				console.error('vid is null, stop it!');
				cb();
				return;
			}
			youku.getVideoInfoByVID(vid, function(data){
				V.title = utils.removeIllegalFolderChar(data.title);
	        	V.path = conf.download.path + V.title + '\\';
				callback(null);
			});
		},
		function (callback){
			var pathname = V.path + V.title + '.mp4';
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
			youku.getVideoList(V.vid, function(data){
				if ( !(data && data.status==='success') ) {
					console.error('[ERROR][v.youku.com]');
					console.error('fail to get the download url list');
					return;
				}
				var hasMp4 = data && data.results.mp4 && data.results.mp4.length;
				var hasFlv = data && data.results.flvhd && data.results.flvhd.length;
				var prefer = conf.youku.defaultFormat.toUpperCase();
				if (hasMp4 && hasFlv && prefer==='MP4') {
					V.urls = data.results.mp4;
					V.postfix = '.mp4';
					callback(null);
					return;
				} else if (hasMp4 && hasFlv && prefer==='FLV') {
					V.urls = data.results.flvhd;
					V.postfix = '.flv';
					callback(null);
					return;
				}
				if (hasMp4) {
					V.urls = data.results.mp4;
					V.postfix = '.mp4';
					callback(null);
					return;
				} else if (hasFlv) {
					V.urls = data.results.flvhd;
					V.postfix = '.flv';
					callback(null);
					return;
				} else {
					console.log('[ERROR] 没有mp4或者flv的视频格式');
				}
			});
		},
		function(callback) {
			var urls = [];
			V.urls.forEach(function(val, index){
				urls.push({
					filename: val.id + V.postfix,
					url: val.url
				});
			});
			if (urls.length===1) {
				urls[0].filename = V.title + V.postfix;
			}
			V.urls = urls;
			var video = {
				urls: urls,
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

function getVidFromPlayPage(url){
    var VID_REG = /id_(\w+)(\.html)?/;
    var ret = url.match(VID_REG);
    if (!ret || !ret.length) {
        console.error('[ERROR][v.youku.com]can not get vid from play page');
        console.error('[ERROR][v.youku.com]RegExp:'+VID_REG.toString());
        console.error('[ERROR][v.youku.com]url:'+url);
    } else if (ret.length>=2){
        return ret[1];
    } else {
        console.error('[ERROR][v.youku.com]getVidFromPlayPage ERROR');
        console.error('[ERROR][v.youku.com]RegExp:'+VID_REG.toString());
        console.error('[ERROR][v.youku.com]url:'+url);
    }
}

exports.download = download;