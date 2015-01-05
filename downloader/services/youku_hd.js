var async = require('async');
var sohu = require('./../libs/sohu');
var utils = require('./../libs/utils');
var conf = require('./../libs/config');
var fs = require('fs');
var dl = require('./download').dl;
var console = require('./../libs/Console');
var V = {
	title: '【09DOTA大根的故事】贺岁篇老虎',
	postfix: '.flv',
};

async.waterfall([
	function(callback){
		var txt = fs.readFileSync('conf/youku_m3u8.txt', 'utf-8');
		var list = txt.split('\r\n');
		var files = [];
		list.forEach(function(val, idx){
			if(val){
				files.push(val);
			}
		});
		V.urls = files;
		V.title = V.title || parseInt(Math.random()*100000000);
		V.postfix = V.postfix || '.mp4';
		V.path = conf.download.path + V.title + '\\';
		callback(null);
	},
	function (callback){
		var pathname = V.path + V.title + V.postfix;
		if (fs.existsSync(pathname)){
			console.warn('[TIPS][File Already Exist]:\n' + pathname);
			return;
		}
		utils.mkdir(V.path, function () {
			callback(null);
		});
	},
	function(callback){
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
]);