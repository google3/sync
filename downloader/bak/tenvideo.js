var config =  require('./config');
var async = require('async');
var utils = require('./libs/utils');
var wget = require('./libs/wget');
var fs = require('fs');
var request = require('./libs/request2');


var conf = {
	cKey: 'YYbwtKBMPh1B1hC7AcOf92BHTSzXvmlYG3u5UyIxHSkItiU-scqmiA',
	pid: 'C1706D12C5074CC261FE3676DE43959C6D532094',
	vid: 'e0012k4wxqk'
};

var URL = {
	host: null,
	path: null,
	Cookie: 'ht_ldns_ip=183.60.62.38; RK=lKlL2XBUXv; pgv_pvi=4430973952; qqB_short=1; isVideo_DC=0; luin=o0522195330; lskey=0001000071dbf95f4d731074c750f11203a8f9436b07bfa6cd85c6731d0ba9f7011e5c4c59150fccb7dbaa5f; uid=23259081; ptisp=ctc; ptcz=f9a1d5cf925d65d99a3046bc094fae8b9052a6e5824bae340ec3fd9db0c5aed5; pt2gguin=o0522195330; uin=o0522195330; skey=@d5uC8w4xg; o_cookie=522195330; pgv_info=ssid=s9606205224; pgv_pvid=2475216045'
};
// var cookie = request.cookie(URL.Cookie)
// j.setCookie(cookie, 'http://vv.video.qq.com/getvinfo');

var url1= 'http://vv.video.qq.com/getvinfo';
request.post(url1, {
	vids:conf.vid,
	vid:conf.vid,
	ran:Math.random(),
	fp2p:1,
	otype:'xml',
	cKey: conf.cKey,
	encryptVer:'2.0',
	appver:'3.2.16.210',
	pid: conf.pid,
	speed:'4439',
	platform:'11',
	charge:'1',
	otype: 'json'
},function(body,headers){
	fs.writeFile('1.txt', body);
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
	// console.log(dataJSON);return;
	URL.path = dataJSON.vl.vi[0].fn;
	// URL.fsha = dataJSON.vl.vi[0].fsha;
	// URL.fmd5 = dataJSON.vl.vi[0].fmd5;
	// URL.level = dataJSON.vl.vi[0].level;
	URL.title = dataJSON.vl.vi[0].ti;
	URL.host = dataJSON.vl.vi[0].ul.ui[0].url;
	URL.count = dataJSON.vl.vi[0].cl.fc;
	// dataJSON.fl.fi.forEach(function(val, index){
	// 	if (val.name==="shd") {
	// 		URL.format = val.id;
	// 	}
	// });
	URL.format = dataJSON.vl.vi[0].cl.ci[0].keyid.split('.')[1];
	console.log(URL);
	// return;
	
	getkey();
},{
	headers: {
		Cookie: URL.Cookie
	}
});

function getkey(){
	var url1= 'http://vv.video.qq.com/getvkey';
	var _interface = '{{$host}}{{$path}}?sdtfrom=v1000&type=mp4&vkey={{$vkey}}';
	var urls = [];
	var index = 0;
	var path = config.downloadPath + URL.title + '\\';
    URL.filepath = path;
	var loop = function () {
		index += 1;
		if (index>URL.count) {
			download(urls);
			return;
		}
		var _path = URL.path.replace(/(\.mp4)/,'\.'+index+'$1');
		console.log(_path);
		var options = {
			url: url1,
			method: 'POST',
			type: 'POST',
			headers: {
				Cookie: URL.Cookie
			}
		};
		var form = {
			encryptVer:'2.0',
			filename: _path,
			ran:Math.random(),
			appver:'3.2.16.210',
			format:URL.format,
			vt:'208',
			vid: conf.vid,
			platform:'11',
			charge:'1',
			otype:'json',
			cKey:conf.cKey
		};
		var cb = function(body, headers){
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
				urls.push(_url);
			}
			
			fs.writeFile('3.txt', urls.join('\n'));
			fs.writeFile('2.txt', body);
			loop();
		};
		request.post(url1, form, cb,{
			headers: {
				Cookie: URL.Cookie
			}
		})
	};
	utils.mkdir(path, function () {
    	loop();
    });
}

function download(_urls){
	var urls = _urls.slice(0);
	var index = 0;
	var loopDownload = function(__urls){
		if (__urls.length===0) {
			return;
		};
		index += 1;
		var url = __urls.shift();
		var pathname = URL.filepath + index+'.mp4';
		wget.download({
        	url: url,
        	pathname: pathname,
        	cb: function () {
        		loopDownload(__urls);
        	}
        });
	};
	loopDownload(urls);
};