var fs=require('fs');
var cp = require('child_process');
var console = require('./../libs/Console');

var path = 'E:\\AA\\';
path = 'F:\\Movies\\android\\';
path = 'F:\\Dropbox\\Documents\\htmls\\';
path = 'F:\\Movies\\';
//path = 'E:\\Downloads\\';
// path = 'F:\\Dropbox\\nodejs\\youku_downloader\\tools\\';
// path = 'F:\\Dropbox\\nodejs\\httpHelper\\';

// fs.writeFile('1.txt', JSON.stringify(ret));


function getDirectoryStructure(folderpath){
    var _obj = {};
    var search=function(path, obj){
    	obj = obj || _obj;
        var _files=fs.readdirSync(path);
        _files.forEach(function(file){
            var pathname = path+'\\'+file,
            	stat = fs.lstatSync(pathname);
	        if (stat.isDirectory()){
	        	if (!obj.folders) {
	            	obj.folders = [];
	            }
	            var tmp ={};
	            tmp[file] = search(pathname, {});
	            obj.folders.push( tmp );
	        }else{
	            if (!obj.files) {
	            	obj.files = [];
	            }
	            obj.files.push(file);
	        }
        });
        return obj;
    };
    search(folderpath);
    return _obj;
}


function getIp(cb){
	cb = cb || function(){};
	var netware = 'Realtek PCIe GBE Family Controller';
	netware = '802.11n USB Wireless LAN Card';
	var shell = 'ipconfig/all';
	var ls = cp.exec(shell, {});
	var R_IP = /\d{1,3}(\.\d{1,3}){3}/g;
	ls.stdout.on('data', function (data) {
	    if (data.indexOf(netware)!==-1){
	    	console.error(data);
	    	var arr =  data.match(R_IP);
	    	if(arr && arr.length===1){
	    		cb(arr[0]);
	    	}
	    }
	});
    ls.on('exit', function (code) {
        // console.log(code);
    });
}


var base_url = 'http://';
var base_port=8080;

getIp(function(ip){
	console.warn(ip);
	base_url = base_url + ip + ':'+base_port+'/';
	console.error(base_url);
});





var reps;
var tmp=[];
function show(data){
	for(var i in data){
		if (data[i].constructor===Object){
			reps.write('<p style="color:red;">'+'[+]'+i+'</p>');
			tmp.push(i);
			show(data[i]);
			tmp.pop();
		} else{
			data[i].forEach(function(val, index){
				if (val.constructor===String) {
					var link = base_url+(tmp.length?(tmp.join('/')+'/'):'')+val;
					reps.write('<p><a href="'+link+'">'+val+'</a></p>');
				}else{
					show(val);
				}
			});
		}
	}
}
var http = require("http");

var baseHTML  = [
	'<style>'
	,'a{color:green;font-style:italic;font-weight:bold;}'
	,'.data{color:gray;}'
	,'</style>'
];
http.createServer(function(request, response) {
	var ret = getDirectoryStructure(path);
	reps = response;
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.write(baseHTML.join(''));
    response.write("<h1>Welcome to Node.js!</h1>");
    response.write('<p class="data">'+JSON.stringify(ret)+'</pre>');
    show(ret);
    response.end();
}).listen(8081);
