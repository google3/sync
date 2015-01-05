var request = require('./request').request;
var utils = require('./utils');
var r = require('request');
var async = require('async');
var conf = require('./config').config;
var proxy = process.env.http_proxy;
var console = require('./../libs/Console');
if (proxy){
    r = r.defaults({'proxy':proxy});
    request.default({proxy: proxy});
}


exports.getVideoInfoByVID = function(vid, cb){
	cb = cb || function(){};
    var _interface = 'https://openapi.youku.com/v2/videos/show_basic.json?video_id={{$vid}}&client_id=b10ab8588528b1b1';
    var url = utils.tpl(_interface, {vid: vid});
    r.get(url, function (error, response, body) {
        var data = JSON.parse(body);
        if (!data.title) {
            console.error('[ERROR][v.youku.com]');
            console.error('error from the url: '+url);
            console.error(data.error.description);
            return;
        }
        cb(data);
    });
};

exports.getVideoList = function(vid, cb){
	cb = cb || function(){};
    // var _interface = 'http://f.youku.com/player/getFlvPath/sid/139461565323405_03/st/mp4/fileid/0300080D02531891F2BD1C04B921BFCDD245C9-DD78-D007-F82E-FCB7919055F3?K=efe8ba860eaf23912411bbc3&hd=1&ts=406&ctype=40';

    var _interface = 'http://m.youku.com/wireless_api3/videos/{{$vid}}/playurl?format=1,2,4,5,6';
    var url = utils.tpl(_interface, {vid: vid});
    console.log(url);
    request.get(url, function (body, headers) {
        var data = JSON.parse(body);
        cb(data);
    });
}


exports.getPlayList = function(vid, cb){
    var _interface = 'http://v.youku.com/player/getPlayList/VideoIDS/{{$vid}}/timezone/+08/version/5/source/video?ev=1&n=3&ctype=10&password=&ran=8577';
    var url = utils.tpl(_interface, {vid: vid});
    request.get(url, function (body, headers) {
        var data = JSON.parse(body);
        cb(data);
    });
}

exports.getHdUrls = function(data, cb){
    var fs = require('fs');
    async.waterfall([
        function(callback){
            var token = '9377';
            var ep = 'eJEfiOPPz8Cm24Z7lUfV2ToXS0Jsv96Mm0DixV6KPaeKaVoX7dW%2FYuNT2lLUI3a0GUOsHItWswXS%2Brw%2B84DSQnSMeIzHt4%2FAqoVtT0Ue%2BiFO7s5Ia%2FXBJwe4i9kbqU9PPeGGbxG6Jv4%3D';
            var url = calcYouKuUrl({
                index: 0,
                data: data,
                token: token,
                ep: ep
            });
            console.log(url);
            fs.writeFile('1.txt', url);
        }
    ], function(){

    });
};

function calcYouKuUrl(opt){
    var jsonobj = opt.data
        ,i = opt.index
        ,_seed = jsonobj.data[0].seed
        ,_key = jsonobj.data[0].segs.flv[i].k
        ,len = jsonobj.data[0].segs.flv.length
        ,fileid = jsonobj.data[0].streamfileids.flv
        ,format = 'flv',
        token = opt.token,
        ep = opt.ep;

    // config
    var params = [
        'ctype=10'
        ,'ev=1'
        ,'token='+token
        ,'oip=236000799'
        ,'ep='+ep
        ,'yxon=1'
    ]

    var mixed, realId;
    getFileID (fileid);

    var II = (i+'').length < 2 ? "0" + i : i;
    var temp1 = realId.slice (0, 8);
    var temp2 = realId.slice (10);
    var temp0 = temp1 + II + temp2;
    var _interface = "http://f.youku.com/player/getFlvPath/sid/00_00/st/{{$format}}/fileid/{{$temp0}}?K={{$K}}" + '&' + params.join('&');
    function getFileID (fileid){
    　　getFileIDMixString ();
    　　var ids = fileid.split ("*");
    　　realId = "";
    　　for (var j = 0; j < ids.length - 1; ++j) {
    　　　　realId = realId + mixed.charAt (parseInt (ids[j]));
    　　}
    }
    function ran (){
    　　_seed = (_seed * 211 + 30031) % 65536;
    　　return (_seed / 65536);
    }
    function getFileIDMixString (){
    　　mixed = "";
    　　var _source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890";
    　　var len = _source.length;
    　　for (var i = 0; i < len; ++i) {
    　　　　var index = parseInt(ran () * _source.length);
    　　　　mixed = mixed + _source.charAt (index);
    　　　　_source = _source.split (_source.charAt (index)).join ("");
    　　}
    }
    return utils.tpl(_interface, {
        K: _key,
        format: format,
        temp0: temp0
    });
        
}