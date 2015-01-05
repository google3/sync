var request = require('./../libs/request').request;
var utils = require('./../libs/utils');
var fs = require('fs');
var conf = require('./../libs/config');
var async = require('async');
var wget = require('./../libs/wget');
var URL = require('url');
var console = require('./../libs/Console');
var html = require('./../libs/html');
var proxy = process.env.http_proxy;
if (proxy){
    request.default({proxy: proxy});
}

var i = {
	filepath: ''
};

var dl = function(urls, cb){
	cb = cb || function(){};
	var loop = function(){
		if(urls.length ===0){
			cb();
			return;
		}
		var url = urls.shift();
		var pathname = [
			conf.imgs.img_path,
			'/',
			i.filepath + '/',
			utils.guid(),
			'.jpg'
		];
		if(!url || url.indexOf('http')===-1){
			loop();
			return;
		}
		wget.download({
	    	url: url,
	    	pathname: pathname.join(''),
	    	cb: function(){
	    		loop();
	    	}
	    });
	};
	loop();
}


async.waterfall([
	function(callback){
		var start_url = conf.imgs.url;
		var base_path = start_url.split('/');
		base_path.pop();
		base_path = base_path.join('/') + '/';
		var imgs = [];
		i.filepath = utils.removeIllegalFolderChar(start_url);
		utils.mkdir(conf.imgs.img_path + '/' +i.filepath);
		// console.log(base_path);
		var loop = function( url, cb ){
			cb = cb || function(){};
			console.info('get url:'+url);
			request.get(url, function(body, headers){
				var next = html.getNextPageATagsFromHTML(body, ' > '),
					href,
					REG_IMG = /arrayImg\[0\]="(.*?)"/g,
					REG_IMG1 = /<img.*?id='myimgurl'\/>/g,
					img;
				if(next && next.length>0){
					next = next[0];
					href = html.getHrefFromA(next);
					if(href && href.length === 2){
						href = href[1];
						if(href.indexOf('http'!==0)){
							href = base_path + href;
						}
					}
				}
				// img = body.match(REG_IMG);
				// if(img && img.length > 0){
				// 	var tmp_img = img.pop().replace('arrayImg[0]="','').replace('"','').replace('/big/','/pic/')
				// 	imgs.push(tmp_img);
				// 	console.info('success get img:' + tmp_img);
				// }
				img = body.match(REG_IMG1);
				if(img && img.length===1){
					img = img[0];
					var tmp = img.match(/src="(.*?)"/);
					if(tmp && tmp.length ===2){
						imgs.push(tmp[1]);
					}
				}
				// console.log(img);
				// return;
				if(href){
					loop(href, cb);
				}else{
					cb(null, imgs);
				}
			});
		};
		loop(start_url, callback);
	},
	function(imgs,callback){
		console.log(imgs);
		// return;
		dl(imgs);
	}
]);
