var request = require('./../libs/request').request;
var utils = require('./../libs/utils');
var fs = require('fs');
var conf = require('./../libs/config');
var async = require('async');
var wget = require('./../libs/wget');
var URL = require('url');
var console = require('./../libs/Console');
var $ = require('jquery');
var html = require('./../libs/html');
var proxy = process.env.http_proxy;
if (proxy){
    request.default({proxy: proxy});
}


var hash = {
	pages: {},
	imgs: {}
};

var data = {
	imgs:[],
	pages:[]
};


var page_index = 1;
var start_url = 'http://www.mnsfz.com/h/meihuo/';
var url_obj = URL.parse(start_url);

getPage(start_url);

function getPage(url){
	if (page_index> 20) {
		pageImg();
		return;
	}
	request.get(url, function(body, headers){
		page_index ++;
		var dom = $(body);
		var imgs = [];
		dom.find('.c_inner .pic a').each(function(index, val){
			var href = url_obj.protocol + '//' + url_obj.hostname+ $(val).attr('href');
			if (! hash.pages.hasOwnProperty(href) ){
				data.pages.push(href);
			}
		});
		var next = dom.find('.cShowPage a');
		var next_href = start_url + $(next.get(next.length-1)).attr('href')
		console.log(  next_href );
		fs.writeFile('pages.txt', data.pages.join(',\n'));
		getPage(next_href);
	});
}

function pageImg(){
	var urls= data.pages.slice(0);
	var loop = function(){
		if (urls.length === 0){
			return;
		}
		var url = urls.shift();
		console.info('request url:' + url);
		request.get(url, function(body, headers){
			// console.log(body);
			var dom = $(body);
			var reg = /http:\/\/mhimg1.mnsfz.com\/big\/meihuo\/.+?\.jpg/g;
			var imgs = body.match(reg);
			// console.log(dom.find('#imgString').html());
			imgs && imgs.forEach(function(val, index){
				var img = val.replace('/big/','/pic/');
				if (!hash.imgs.hasOwnProperty(img)){
					data.imgs.push(img);
				}
			});
			loop();
			fs.writeFile('images.txt', data.imgs.join(',\n'));
		});
	};
	loop();
	
}




