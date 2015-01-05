var http = require('http');
var https = require('https');
var fs = require('fs');
var Url = require('url');
var qs=require('querystring');

var HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    // "Cache-Control":"max-age=0",
    // "Connection":"keep-alive",
    // 'Content-Type':'text/xml; charset=utf-8',
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"
}


function exec(url, data, cb, opt){
    opt = opt || {};
    opt.headers = opt.headers || {};
    var params = Url.parse(url);
    for (var i in opt) {
        if (i !== 'options') {
            params[i] =  opt[i];
        }
    }
    params.rejectUnauthorized = false;
    if ( opt.method === 'POST') {
        if (typeof data === 'string') {
            params.headers['Content-Type'] = 'application/json; charset=UTF-8';
            var content=data;
        } else {
            var content=qs.stringify(data);
            params.headers['Content-Type'] = 'application/x-www-form-urlencoded';    
        }
        params.headers['Content-Length'] = content.length;
    }
    for (var j in HEADERS) {
        params.headers[j] = HEADERS[j];
    }
    
    if ( opt.options && opt.options.hostname ) {
        for (var k in opt.options) {
            params[k] = opt.options[k];
        }
        params.path = url;
    }
    var isHttps = params.protocol==='https:';
    var server = isHttps ? https : http;
    // console.log(params);return;
    var req = server.request(params, function(res){
        var buffers = [];
        res.on('data', function(buffer) {
            buffers.push(buffer);
        });
        res.on('end', function() {
            var html = buffers.join('');
            cb.call(null, html, res.headers);
        });
    });
    // console.log(content, opt.method);
    if ( opt.method === 'POST') {
        req.write(content);
    }
    req.end();
}

function get(url, cb, opt){
    opt = opt || {};
    opt.method = 'GET';
    exec( url, null, cb, opt);
}

function post(url, data, cb, opt){
    opt = opt || {};
    opt.method = 'POST';
    exec( url, data, cb, opt);
}

function download(url, path, _filename,_opt){
    console.log('下载img: '+ url);
    if (url.indexOf('http') !==0 ) {
        console.log('url格式错误!');
        return;
    }
    _opt = _opt || {};
    _opt.headers = _opt.headers || {};
    path = path || "./";
    var opt = Url.parse(url), filename;
    var fileName = opt.pathname.split('/').pop();
    var fileExt = fileName.split('.');
    if (fileExt.length === 2) {
        fileExt = fileExt.pop();
    }else {
        fileExt = 'jpg';
    }
    if(typeof _filename==='undefined' || _filename === null){
        filename = fileName;
    }else{
        filename = _filename + '.' + fileExt;
    }
    var filepath = path + filename;
    var file = fs.createWriteStream(filepath);
    opt.method = 'GET';
    opt.rejectUnauthorized = false;
    var isHttps = opt.protocol==='https:';
    var server = isHttps ? https : http;
    opt.headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"
    };
    for(var i in _opt.headers){
        opt.headers[i] = _opt.headers[i];
    }
    if ( _opt.options && _opt.options.hostname ) {
        for (var k in _opt.options) {
            opt[k] = _opt.options[k];
        }
        opt.path = url;
    }
    var req = server.request(opt, function(res){
        res.on('data', function(buffer) {
            file.write(buffer);
        });
        res.on('end', function() {
            file.end();
            console.log("log: " + filename + ' is download!');
            _opt.cb && _opt.cb(res.headers);
        });
    });
    req.end();
}


exports.get = get;
exports.post = post;
exports.download = download;

