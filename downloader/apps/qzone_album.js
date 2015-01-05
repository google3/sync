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

//

var getcookie = function(name) {
	var r = (new RegExp("\\b" + name + "\\b=([^\\s;]+);?", "gi")).exec(conf.qzone.Cookie);
	return r && r[1] && unescape(r[1]);
};



var headers = {
	Cookie: conf.qzone.Cookie
};
var qz = {
	album:[],
	g_tk: get_token(),
	qq: getcookie('uin').replace(/[a-zA-Z]/,'')
};

async.waterfall([
	function(callback){
		var _interface = 'http://user.qzone.qq.com/p/shalist.photo/fcgi-bin/fcg_list_album_v3?t=796545237&hostUin={{$qq}}&uin={{$qq}}&appid=4&inCharset=utf-8&outCharset=utf-8&source=qzone&plat=qzone&format=jsonp&notice=0&filter=1&handset=4&pageNumModeSort=40&pageNumModeClass=10&needUserInfo=1&idcNum=4&callbackFun=shine0&g_tk=' + qz.g_tk;
		var url = utils.tpl(_interface,{
			qq: qz.qq
		});
		request.get(url, function(body, headers){
			// console.info(body);return;
			var str = body.replace('shine0_Callback(','').replace(/\);$/,'');
			var data = JSON.parse(str);
			if(!data.data.albumListModeSort){
				console.error(str);
				if (conf.qzone.reTry === 'true'){
					
				}
				return;
			}
			qz.album = data.data.albumListModeSort;
			// console.log(qz.album);
			callback();
		},headers);

	},
	function(callback){
		var list = [], index=0, arrs = qz.album.slice(0),len=arrs.length;
		var loop = function(){
			if (index===len){
				// console.log(list);
				console.info('get imgs url done!');
				qz.list = list;
				fs.writeFile('qzone.txt', JSON.stringify(list));
				callback(null);
				return;
			};
			var _interface = 'http://user.qzone.qq.com/p/shplist.photo/fcgi-bin/cgi_list_photo?t=329641432&mode=0&idcNum=4&hostUin={{$qq}}&topicId={{$id}}&noTopic=0&uin={{$qq}}&pageStart=0&pageNum=1000&skipCmtCount=0&singleurl=1&batchId=&notice=0&appid=4&inCharset=utf-8&outCharset=utf-8&source=qzone&plat=qzone&outstyle=json&format=jsonp&json_esc=1&question=&answer=&callbackFun=shine0&g_tk=' + qz.g_tk;
			var url = utils.tpl(_interface,{
				qq: qz.qq,
				id: qz.album[index].id
			});
			console.info('request url: ' + url);
			request.get(url, function(body, headers){
				// console.log(body);return
				var str = body.replace('shine0_Callback(','').replace(/\);$/,'');
				fs.writeFile('data/'+qz.album[index].id+'.txt', str);
				var data = JSON.parse(str);
				var arr = data.data.photoList;
				var ret = [];
				arr&&arr.forEach(function(val, index){
					(val.origin_url || val.url)&&ret.push(val.origin_url || val.url);
				});
				var filename = utils.removeIllegalFolderChar(qz.album[index].name)
				var path = conf.download.path 
					+ '\\' + conf.qzone.album
					+ '\\' + qz.qq
					+ '\\' + filename;
				// var path = conf.download.path + '\\qzone_album\\' + filename;
				utils.mkdir(path);
				list.push({
					name: filename,
					imgs: ret
				});
				index += 1;
				loop();
			},headers);
		};
		loop();
	},
	function(){
		var arr = qz.list.slice(0);
		var loopDownload = function(){
			if (arr.length===0){
				console.log('ok1');
				return;
			}
			var album = arr.shift();
			var imgs = album.imgs;
			var loop = function(){
				if (imgs.length===0){
					console.info('[DONE]:' + album.name);
					return;
				}
				var img = imgs.shift();
				var filename = utils.guid()+'.jpg';
				var path = conf.download.path 
					+ '\\' + conf.qzone.album
					+ '\\' + qz.qq
					+ '\\' + album.name 
					+ '\\' + filename;
				wget.download({
			    	url: img,
			    	pathname: path,
			    	cb: function(){
			    		setTimeout(function(){
			    			loop();
			    		},100);
			    	}
			    });
			};
			loop();
			loopDownload();
		};
		loopDownload();
	}
]);



function get_token(){
	var hash = 5381,
	str = getcookie("p_skey") || getcookie("skey") || getcookie("p_lskey") || getcookie("lskey");
	if (str) {
		for (var i = 0, len = str.length; i < len; ++i) {
			hash += (hash << 5) + str.charCodeAt(i);
		}
		return hash & 0x7fffffff;
	} else {
		return hash;
	}
}