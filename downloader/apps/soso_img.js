var request = require('./../libs/request').request;
var utils = require('./../libs/utils');
var fs = require('fs');
var conf = require('./../libs/config');
var async = require('async');
var wget = require('./../libs/wget');
var console = require('./../libs/Console');
var proxy = process.env.http_proxy;
if (proxy){
    request.default({proxy: proxy});
}

getJSON();

function getJSON(){
	var url = 'http://image.soso.com/pics/channel/getRecomPicByTag.jsp?category=明星&tag=范冰冰&len=30&start=0';
	url = 'http://image.soso.com/pics/channel/getRecomPicByTag.jsp?category='+
	encodeURIComponent('明星')+'&tag='+
	encodeURIComponent('周杰伦')+
	'&start=0&len=300';
	request.get(url, function(body, header){
		var data = JSON.parse(body);
		var imgs = [];
		if(!data || !data.items){
			console.error('no data');
			return;
		}
		data.items.forEach(function(val, index){
			imgs.push("<img width=200 height=200 src='"+val.ori_pic_url+"' >");
		});
		fs.writeFile('soso_imgs.html', imgs.join('\n\r'));
	});
}

