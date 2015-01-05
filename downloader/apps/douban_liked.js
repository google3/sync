var request = require('./../libs/request').request;
var utils = require('./../libs/utils');
var fs = require('fs');
var conf = require('./../libs/config');
var async = require('async');
var wget = require('./../libs/wget');
var proxy = process.env.http_proxy;
// proxy='http://127.0.0.1:8888';
if (proxy){
    request.default({proxy: proxy});
}

var url_interface ='http://douban.fm/j/play_record?ck=dRGj&spbid=%3A%3AQaF82xgc89c&type=liked&start={{$start}}';
var headers={
	Cookie: 'bid="QaF82xgc89c"; dbcl2="48951696:2S0Sfq4uu+g"; fmNlogin="y"; ck="dRGj"; sawred=1; __utma=58778424.1676177745.1397632739.1397632739.1398857962.2; __utmb=58778424.7.9.1398857968255; __utmc=58778424; __utmz=58778424.1397632739.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=58778424.4895',
	'X-Requested-With':'XMLHttpRequest',
	'Referer':'http://douban.fm/mine'
};
var s = {songs:[], musics:[], index: 1};

fs.readFile('musics.txt','utf-8',function(err, data){
	if (data){
		var json = JSON.parse(data);
		s.musics = json;
		download();
	} else{
		getSongUrl();
	}
});

function getSongUrl(){
	async.waterfall([
		function(callback){
			fs.readFile('songs.txt','utf-8',function(err, data){
				if (data){
					var json = JSON.parse(data);
					s.songs = json;
					callback();
				}
			});
		},
		function(callback){
			// console.log(s.songs);return;
			if (s.songs.length) {
				callback();
				return;
			}
			var getSongs = function(cb){
				cb = cb || function(){};
				var start = (s.index-1) * (s.pageSize || 0);
				var url = utils.tpl(url_interface,{start: start});
				// console.log(url);
				request.get(url, function(body, headers){
					var data = JSON.parse(body);
					s.count = data.total;
					s.pageSize = data['per_page'];
					s.pageCount = Math.ceil(s.count/s.pageSize);
					s.songs = s.songs.concat(data.songs);
					console.log(s.songs.length);
					s.index +=1;
					if (s.index <= s.pageCount){
						setTimeout(function(){
							getSongs();
						},1000);
					}else{
						callback();
					}
				}, headers);
			};
			getSongs();
			fs.writeFile('songs.txt', JSON.stringify(s.songs));
		},
		function(callback){
			var songs = s.songs.slice(0);
			var s_interface = 'http://douban.fm/j/mine/playlist?type=n&sid=&pt=0.0&channel=0&context=channel:0|subject_id:{{$subject_id}}&from=mainsite&r={{$rnd}}';
			var songs_url = function(){
				if (songs.length===0){
					callback();
					return;
				}
				var song = songs.shift();
				var subject = song.path.split('/');
				var subjectId = subject[subject.length-2];
				var title = song.title;
				var sid = song.id;
				var artist = song.artist;
				var url = utils.tpl(s_interface, {
					subject_id: subjectId,
					rnd: Math.random()
				});
				request.get(url, function(body, headers){
					if (body) {
						var s_data = JSON.parse(body);
						// console.log(s_data);
						if (s_data.r !==0){
							// songs_url();
							return;
						}
						s_data.song.forEach(function(val, index){
							if (val.sid === sid){
								s.musics.push({
									sid: sid,
									title: title,
									artist: artist,
									mp3: val.url
								});
								console.log(title);
								fs.writeFile('musics.txt', JSON.stringify(s.musics));
								return false;
							}
						});
					}
					// console.log(s.musics);
					setTimeout(function(){
						songs_url();
					},400);
				});
				// console.log(subjectId);
			};
			songs_url();
		},
		function(callback){
			console.log(s.musics.length);
			download();
		}
	], function(){

	});
}

function download(){
	var musics = s.musics.slice(0);
	var path = 'E:\\douban\\';
	var loop = function(){
		if (musics.length===0){
			console.log("DOWNLOAD FINISHED!");
			return;
		}
		var music = musics.shift();
		wget.download({
	    	url: music.mp3,
	    	pathname: path+'['+ utils.removeIllegalFolderChar(music.artist)+']'+utils.removeIllegalFolderChar(music.title)+'.mp4',
	    	cb: function(){
	    		loop();
	    	}
	    });
	};
	loop();
}

