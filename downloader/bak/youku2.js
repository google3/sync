


var config =  require('./config');
var async = require('async');
var utils = require('./libs/utils');
var wget = require('./libs/wget');
var fs = require('fs');
var request = require('./libs/request2');

var url='http://k.youku.com/player/getFlvPath/sid/00_00/st/flv/fileid/0300020301534F2985AB1B13E0FC15B156B556-D56A-A444-9102-B45CD328525A?K=de37d624147a51d528297859&hd=2&myp=0&ts=189&ymovie=1&ypp=2&ctype=10&ev=1&token=7804&oip=236000799&yxon=1';
var options = {
	options: {
		hostname: 'proxy.tencent.com',
		port: '8080'
	}
};

// url='http://www.baidu.com';
// url='http://k.youku.com/player/getFlvPath/sid/6397718892238108de524_00/st/flv/fileid/030001050053467B577F9013E0FC15BA53529B-E2EF-7CFE-CFED-7F8A3DD75280?K=58be28ec150c72fd261d9f1c&hd=2&myp=0&ts=189&ymovie=1&ypp=2&ctype=10&ev=1&token=7804&oip=236000799&ep=%2B1nwSWKguqozU1u0fG37fnhr5%2FIK0pvET4DLcQnb6SvJOv3HeHDyRI3BhMr0OopsRnYqOPt9cgvUaBeR3N5bvDrnVTKNoFWfVCNFIGdAsWyIe2slFzTrZsMsHwaAV7lGrmNxV85AnrU%3D&yxon=1&special=true'

url='http://k.youku.com/player/getFlvPath/sid/6397718892238108de524_00/st/flv/fileid/030001050053467B577F9013E0FC15BA53529B-E2EF-7CFE-CFED-7F8A3DD75280?K=58be28ec150c72fd261d9f1c&hd=2&yxon=1&myp=0&ts=189&ymovie=1&ypp=2&ctype=10&ev=1&token=7804&oip=236000799&ep=%2B1nwSWKguqozU1u0fG37fnhr5%2FIK0pvET4DLcQnb6SvJOv3HeHDyRI3BhMr0OopsRnYqOPt9cgvUaBeR3N5bvDrnVTKNoFWfVCNFIGdAsWyIe2slFzTrZsMsHwaAV7lGrmNxV85AnrU%3D'
request.get(url, function(body, headers){
	console.log(body);
},options);