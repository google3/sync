var request = require('./request').request;
var utils = require('./utils');
var async = require('async');
var conf = require('./config');
var proxy = process.env.http_proxy;
var console = require('./../libs/Console');
if (proxy){
    request.default({proxy: 'http://proxy.tencent.com:8080'});
}


var v = {};

exports.getUrlsByVid = function(vid, cb){
	cb = cb || function(){};
	getVideosUrl(vid, cb);
};

exports.getVidFromUrl = function (url, cb){
	console.info('[INFO][request]');
	console.info('url:' + url);
	request.get(url, function (body, headers) {
		// console.log(body);
		if (body.length<500){
			console.error('[ERROR][HTTP][DNS Redirect]');
			console.error(body);
			return;
		}
        var REG = /var vid\s*=\s*['"](\d+)['"]/;
        var arr = body.match(REG);
        if (arr && arr.length ===2) {
        	cb(arr[1]);
        	return;
        }
        console.error('[ERROR][tv.sohu.com]');
        console.error('can not get vid from play page');
        console.error('url: '+url);
        console.error('RegExp:' + REG.toString());
        cb(null);
    });
};

function getVideosUrl(vid, cb){
	async.waterfall([
		function (callback) {
			var _interface = 'http://hot.vrs.sohu.com/vrs_flash.action?vid={{$vid}}';
		    var url = utils.tpl(_interface, {vid: vid});
		    request.get(url, function (body, headers) {
	            var data = JSON.parse(body);
	            // console.log(conf);return;
	            if (conf.sohu.findHD) {
	            	var _vid = data.data.oriVid 
		            		|| data.data.superVid
		            		|| data.data.highVid;
		            _vid = _vid.toString();
		            if (_vid !== vid) {
		            	getVideosUrl(_vid, cb);
		            	return;
		            }
	            }
	            v.clipsURL = data.data.clipsURL;
	            v.su = data.data.su;
	            v.title = utils.removeIllegalFolderChar( data.data.tvName );
	            callback(null, data);
		    });
		},
		function (args1, callback){
			var urls = [];
			var _interface = 'http://220.181.61.213/?prot=2&file={{$part1}}&new={{$part2}}';
			args1.data.clipsURL.forEach(function(val, index){
				var url = utils.tpl(_interface, {
					part1: val,
					part2: args1.data.su[index]
				});
				urls.push(url);
			});
			callback(null, urls);
		},
		function (args1, callback){
			var urls = args1.slice(0);
			var texts = [];
			var loopRequest = function (urls) {
				if (urls.length===0) {
					callback(null, texts);
					return;
				}
				var url = urls.shift();
				request.get(url, function (body, headers) {
			        texts.push(body);
			        loopRequest(urls);
			    });
			};
			loopRequest(urls);
		},
		function (args1, callback) {
			var videos = [];
			args1.forEach(function (val, index) {
				var arr = val.split('|');
				var url = [
					arr[0].replace(/\/$/, ''),
					v.su[index],
					'?key='+arr[3]
				];
				videos.push(url.join(''));
			});
			v.urls = videos;
			callback(null);
		}
	], function (err, result){
		cb(v);
	});
	
}




