var http = require('http');
var https = require('https');
var fs = require('fs');
var Url = require('url');
var qs=require('querystring');


// https.globalAgent.options.secureProtocol = 'SSLv2_method';
var HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"
};

function request() {
    this.config = {};
};

request.prototype.httpRequest = function(options){
    options = options || {};
    options.headers = options.headers || {};
    options.cb = options.cb || function(){};

    // check main params
    var is_params_pass = true;
    ['url'].forEach(function(val, index){
        if (!options.hasOwnProperty(val)) {
            console.log('[ERROR PARAMS]: missing param('+val+')');
            is_params_pass = false;
        }
    });
    if (!is_params_pass) {
        return;
    }

    // set params
    var params = {
        rejectUnauthorized: false,
        strictSSL: false,
        // secureProtocol: 'SSLv3_client_method'
    };
    var urlParams = Url.parse(options.url);
    var defaultOption = ['protocol','host','hostname','hash','search','query','pathname','path','href'];
    defaultOption.forEach(function(val, index){
        params[val] = urlParams[val];
    });
    params.method = options.method.toUpperCase();

    // set proxy
    // console.log(this.config);
    if (this.config.proxy){
        var reg_result_list = this.config.proxy.match(/(http:\/\/)?([\w\.]+):(\d+)/);
        if (reg_result_list.length===4) {
            params.hostname = reg_result_list[2];
            params.port = reg_result_list[3];
            params.path = options.url;
        }else {
            console.log('[ERROR PROXY]');
            return;
        }
    }

    // params.port = 443;
    
    // set headers
    var headers = {};
    for (var key in HEADERS) {
        headers[key] = HEADERS[key];
    }
    for (key in options.headers) {
        headers[key] = options.headers[key];
    }
    headers.Host = params.host;

    // set post options
    var post_content;
    if (options.method.toUpperCase()==='POST') {
        headers['Content-Type'] = typeof options.data==='string' 
            ?  (post_content=data, 'application/json; charset=UTF-8'): 
                (post_content=qs.stringify(options.data),'application/x-www-form-urlencoded');
        headers['Content-Length'] = post_content.length;
    }
    // console.log(headers);return;

    // do request
    var isHttps = params.protocol==='https:';
    // console.log(isHttps, params.protocol);return;
    var server = isHttps ? https : http;
    params.headers = headers;
    // console.log(params);return;
    // (function(){
    //     var arr=[];
    //     for(var i in headers) {
    //         arr.push(i+':'+headers[i]);
    //     }
    //     fs.writeFile('2.txt', arr.join('\n'));
    // })();
    
    var req = server.request(params, function(res){
        var buffers = [];
        res.on('data', function(buffer) {
            buffers.push(buffer);
        });
        res.on('end', function() {
            var body = buffers.join('');
            options.cb.call(null, body, res.headers);
        });
    });
    // console.log( options.method.toUpperCase() === 'POST' );
    if ( options.method.toUpperCase() === 'POST') {
        req.write(post_content);
    }
    req.end();
};

request.prototype.default = function(options){
    var avai = ['proxy'];
    for (var key in options) {
        if (avai.indexOf(key)!==-1) {
            this.config[key] = options[key];
        }
    }
};

request.prototype.get = function(url, cb, headers){
    this.httpRequest({
        method: 'get',
        url: url,
        cb: cb,
        headers: headers
    });
};

request.prototype.post = function(url, data, cb, headers){
    this.httpRequest({
        method: 'post',
        url: url,
        data: data,
        cb: cb,
        headers: headers
    });
};




exports.request = new request;


function exec(url, data, cb){
    var params = Url.parse(url);
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

// exports.get = get;
// exports.post = post;
// exports.download = download;

// function download(url, path, _filename,_opt){
//     console.log('下载img: '+ url);
//     if (url.indexOf('http') !==0 ) {
//         console.log('url格式错误!');
//         return;
//     }
//     _opt = _opt || {};
//     _opt.headers = _opt.headers || {};
//     path = path || "./";
//     var opt = Url.parse(url), filename;
//     var fileName = opt.pathname.split('/').pop();
//     var fileExt = fileName.split('.');
//     if (fileExt.length === 2) {
//         fileExt = fileExt.pop();
//     }else {
//         fileExt = 'jpg';
//     }
//     if(typeof _filename==='undefined' || _filename === null){
//         filename = fileName;
//     }else{
//         filename = _filename + '.' + fileExt;
//     }
//     var filepath = path + filename;
//     var file = fs.createWriteStream(filepath);
//     opt.method = 'GET';
//     opt.rejectUnauthorized = false;
//     var isHttps = opt.protocol==='https:';
//     var server = isHttps ? https : http;
//     opt.headers = {
//         "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
//         "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"
//     };
//     for(var i in _opt.headers){
//         opt.headers[i] = _opt.headers[i];
//     }
//     if ( _opt.options && _opt.options.hostname ) {
//         for (var k in _opt.options) {
//             opt[k] = _opt.options[k];
//         }
//         opt.path = url;
//     }
//     var req = server.request(opt, function(res){
//         res.on('data', function(buffer) {
//             file.write(buffer);
//         });
//         res.on('end', function() {
//             file.end();
//             console.log("log: " + filename + ' is download!');
//             _opt.cb && _opt.cb(res.headers);
//         });
//     });
//     req.end();
// }




