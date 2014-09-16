var fs = require('fs');
var cp = require('child_process');

var ips = [];
var ips_ok=[];
fs.readFile('hosts.txt', 'utf-8', function(err,data){
	var R_IP = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
	ips = data.match(R_IP);
	ips=unique(ips);
	// console.log(ips);return;

	var _ips=ips.slice(0);
	var loop = function(){
		console.log(' ');
		console.log(' ');
		console.log('已完成:' + (ips.length-_ips.length) + '/' + ips.length);
		if(_ips.length===0){
			console.log('all loop done');
			console.log(ips_ok);
			return;
		}
		var host = _ips.shift();
		check_ip_port(host, 443, function(flag){
			if(flag===1){
				console.log('[ok]'+host);
				ips_ok.push(host);
			}else if(flag===0){
				console.log('[no]'+host);
			}else{
				console.log('[??]'+host);
			}
			loop();
		});
	};
	loop();
});

//nslookup -q=TXT _netblocks.google.com 8.8.8.8
//http://blog.163.com/zhangbuzhi08@126/blog/static/86944669201312311740122/

function check_ip_port(host, port, cb){
	cb=cb||function(){};
	var net = require('net');
	var socket = net.createConnection(port, host);
	console.log('[Socket created]'+host+':'+port);

	socket.setTimeout(2000,function(){
		console.log('连接超时');
		socket.end();
		cb(0);
	});
	socket.on('data', function(data) {
	  // Log the response from the HTTP server.
	  console.log('RESPONSE: ' + data);
	}).on('connect', function() {
	  // Manually write an HTTP request.
	  socket.write("GET / HTTP/1.0\r\n\r\n");
	}).on('end', function() {
	  console.log('DONE');
	  cb(1);
	}).on('error', function(err) {
	  console.log(err);
	  cb(0);
	});
}

function unique(arr){
	var hash={}, tmp=[];
	for(var i=0,len = arr.length;i<len;i++){
		if(!hash.hasOwnProperty(arr[i])){
			tmp.push(arr[i]);
			hash[arr[i]]=null;
		}
	}
	return tmp;
}	