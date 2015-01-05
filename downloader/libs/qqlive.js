var request = require('./request').request;
var utils = require('./utils');
var fs = require('fs');
var conf = require('./config');
var async = require('async');
var proxy = process.env.http_proxy;
if (proxy){
    request.default({proxy: proxy});
}



exports.getInfoByPlaypageurl = function(url, cb){
    request.get(url, function(body, headers){
        var REG = /var VIDEO_INFO\s*=\s*(\{[^\}]+\})/;
        var ret = body.match(REG);
        if ( ret && ret.length === 2 ) {
            try{
                eval(ret[0]);
                cb(VIDEO_INFO);
            }catch(e){
                console.log('[ERROR](getInfoByPlaypageurl): ' + e);
            }
        }else {
            cb({});
        }
    });
};

exports.getDownloadUrlByVid = function(vid, cb){
	cb = cb || function(){};
	var _interface = 'http://vv.video.qq.com/geturl?vid={{$vid}}&otype=json';
	var url = utils.tpl(_interface, {vid: vid});
	request.get(url, function(body, headers){
		var str = body.replace('QZOutputJson=','').replace(/;$/,'');
		var data;
        try {
        	data = JSON.parse(str);
        } catch(e){
        	console.log('[JSON PARSE ERROR]: ' + body);
        }
        cb(data);
	});
};

exports.findHdUrls = function(vid, cb){
    async.waterfall([
        function(callback){
            var url= 'http://vv.video.qq.com/getvinfo';
            var data= {
                vids: vid,
                vid: vid,
                ran: Math.random(),
                fp2p:1,
                otype:'xml',
                cKey: conf.tenvideo.cKey,
                encryptVer:conf.tenvideo.encryptVer,
                appver:conf.tenvideo.appver,
                pid: conf.tenvideo.pid,
                speed:'4080',
                fhdswitch:0,
                platform:'11',
                charge:'1',
                otype: 'json'
            };
            var headers = {
                Cookie: conf.tenvideo.Cookie
            };
            var URL = {};
            request.post(url, data, function(body, headers){
                console.log(body);
                if (!body || body.indexOf('QZOutputJson')===-1) {
                    console.log(body);
                    return;
                }
                var data = body.replace('QZOutputJson=','').replace(/;$/,'');
                var dataJSON = JSON.parse(data);
                if (!dataJSON.vl) {
                    console.log(dataJSON);
                    return;
                }
                URL.path = dataJSON.vl.vi[0].fn;
                URL.title = utils.removeIllegalFolderChar(dataJSON.vl.vi[0].ti);
                URL.host = dataJSON.vl.vi[0].ul.ui[0].url;
                URL.count = dataJSON.vl.vi[0].cl.fc;
                URL.format = dataJSON.vl.vi[0].cl.ci[0].keyid.split('.')[1];
                // console.log(URL);
                callback(null, URL);
            }, headers);
        },
        function(URL, callback){
            var url= 'http://vv.video.qq.com/getvkey';
            var _interface = '{{$host}}{{$path}}?sdtfrom=v1000&type=mp4&vkey={{$vkey}}';
            var urls = [];
            var index = 0;
            var path = conf.download.path + URL.title + '\\';
            URL.filepath = path;
            var loop = function () {
                index += 1;
                if (index>URL.count) {
                    callback(null, urls, URL);
                    return;
                }
                var _path = URL.path.replace(/(\.mp4)/,'\.'+index+'$1');
                // console.log(_path);
                var headers = {
                    Cookie: conf.tenvideo.Cookie
                };
                var data = {
                    encryptVer:'2.0',
                    filename: _path,
                    ran:Math.random(),
                    appver:conf.tenvideo.appver,
                    format:URL.format,
                    vt:'208',
                    vid: vid,
                    platform:'11',
                    charge:'1',
                    otype:'json',
                    cKey:conf.tenvideo.cKey
                };
                var _cb = function(body, headers){
                    // console.log(body);
                    if (body.indexOf('QZOutputJson')===-1) {
                        console.log(body);
                        return;
                    }
                    var data = body.replace('QZOutputJson=','').replace(/;$/,'');
                    var dataJSON = JSON.parse(data);
                    if (dataJSON.key) {
                        var _url = utils.tpl(_interface, {
                            host: URL.host,
                            path: _path,
                            vkey: dataJSON.key
                        });
                        console.log(_path);
                        urls.push(_url);
                    }
                    loop();
                };
                request.post(url, data, _cb,headers);
            };
            loop();
        },
        function(_urls, URL, callback){
            var urls = [];
            if (_urls && _urls.length ===1){
                urls.push({
                    filename: URL.title+'.mp4',
                    url: _urls[0]
                });
                cb({
                    urls: urls,
                    title: URL.title
                });
                return;
            }
            for(var i=0, len=_urls.length; i<len;i++){
                urls.push({
                    filename: (i+1)+'.mp4',
                    url: _urls[i]
                });
            }
            cb({
                urls: urls,
                title: URL.title
            });
        }
    ], function(){});
    
    
    
};