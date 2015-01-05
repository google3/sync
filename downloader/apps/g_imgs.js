var request = require('./../libs/request').request;
var utils = require('./../libs/utils');
var fs = require('fs');
var conf = require('./../libs/config');
var async = require('async');
var wget = require('./../libs/wget');
var URL = require('url');
var console = require('./../libs/Console');
// var $ = require('jquery');
var html = require('./../libs/html');
var proxy = process.env.http_proxy;
if (proxy){
    request.default({proxy: proxy});
}

var args = process.argv.slice(2);


var hash ={
	links: {},
	imgs:{}
};



var base_site = 'http://www.eerlu.com/news/37_{{$page}}.html';
base_site = 'http://www.eerlu.com/vod/10_{{$page}}.html';

function getLinks(url, cb){
	cb = cb || function(){};
	var urlObj = URL.parse(base_site);
	var domain = urlObj.protocol + '//' + urlObj.hostname;
	var REG = /\/\d+\/\d+\.html/;
	// console.log(domain);return;
	request.get(url, function(body, headers){
		// console.log(body);
		var as = html.getLinksFromHTML(body);
		var ret = [];
		as.forEach(function(val, index){
			// console.log(val);
			if ( REG.test(val) ){
				ret.push(domain+val);
			}
		});
		console.log('ret length='+ ret.length);
		cb(ret);
		// console.log(ret);
		// var dom = $(body);
		// console.log(dom.find('.mainArea ul a').length);
	});
}

var end = 5;

async.waterfall([
	function(callback){
		if (!args[0] && args[0]==='dl'){
			return;
		}
		var start = 0;
		var p_imgs =[];
		var page_n = function(page){
			var url = utils.tpl(base_site, {page:page});
			getLinks(url, function(_urls){
				var urls = _urls.slice(0);
				var loop = function(){
					if(urls.length===0){
						console.log('loop ok');
						if (page>end){
							return;
						}
						page_n(start++);
						return;
					}
					var url = urls.shift();
					console.log('request url=' + url);
					request.get(url, function(body, headers){
						var imgs = html.getImgsSrcFromHTML(body, 'pagespeed_lazy_src', /pagespeed_lazy_src="(\S+)"/ig);
						console.log('imgs length ='+imgs.length);
						imgs.forEach(function(val, index){
							if(hash.imgs.hasOwnProperty(val)){
								return true;
							}else{
								hash.imgs[val]=null;
								p_imgs.push(val);
							}
						});
						fs.writeFile('g_img_txt/imgs'+page+'.txt', JSON.stringify(p_imgs));
						loop();
					});
				};
				loop();
			});
		};
		page_n(start);
	}
]);




async.waterfall([
	function(callback){
		if (!args[0] && args[0]==='get'){
			return;
		}
		var start = 0;
		var imgs = [];
		var loop = function(){
			if (start > end){
				callback(null, imgs);
				return;
			}
			fs.readFile('g_img_txt/imgs'+(start)+'.txt','utf-8', function(err, data){
				start += 1;
				if (data){
					var _imgs = JSON.parse(data);
					imgs = imgs.concat(_imgs);
				}
				loop();
			});
		};
		loop();
	},
	function(imgs, callback){
		console.log(imgs.length);
		downloadImgs(imgs);
	}
]);





function downloadImgs(_imgs, cb){
	var imgs = _imgs.slice(0);
	var path = 'E:\\g_imgs\\';
	var loop = function(){
		if (imgs.length===0){
			console.log("DOWNLOAD FINISHED!");
			return;
		}
		var img = imgs.shift();
		console.log(img);
		wget.download({
	    	url: img,
	    	pathname: path+utils.guid()+'.webp',
	    	cb: function(){
	    		loop();
	    	}
	    });
	};
	loop();
}

