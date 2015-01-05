var conf = require('./libs/config');
var async = require('async');
var getVideosUrls = require('./libs/sortVideoUrls').getVideosUrls;
var Url = require('url');
var youku = require('./services/youku');
var txvideo = require('./services/txvideo');
var sohu = require('./services/sohu');
var console = require('./libs/Console');



async.waterfall([
	function(callback){
		getVideosUrls(function(urls){
			callback(null, urls);
		});
	},
	function(args1, callback){
		var urls = args1.slice(0);
		var loopFetch = function(urls){
			if (urls.length===0) {
				callback(null)
				return;
			}
			var url = urls.shift();
			var params =  Url.parse(url);
			console.info('[INFO]play page url:');
			console.info(url);
			if (params.host==='v.qq.com') {
				txvideo.download(url, function(){
					console.warn("[TIPS][WAITING 5's FOR THE NEXT DOWNLOAD FETCH]");
					setTimeout(function(){
						loopFetch(urls);
					},1*1000);
				});
			} else if (params.host==='v.youku.com') {
				youku.download(url, function(){
					loopFetch(urls);
				});
			} else if (params.host==='tv.sohu.com') {
				sohu.download(url, function(){
					loopFetch(urls);
				});
			}else if(conf.tenvideo.findHD==='true' && conf.tenvideo.vid){
				txvideo.download('');
			}
		};
		loopFetch(urls);
	},
	function(){

	}
],function(){

});



