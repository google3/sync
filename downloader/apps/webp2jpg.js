/**
 * webp site: https://code.google.com/p/webp/
 * doc: https://developers.google.com/speed/webp/docs/dwebp?hl=zh-CN
 */


var utils = require('./../libs/utils');
var fs = require('fs');
var conf = require('./../libs/config');
var async = require('async');
var cp = require('child_process');
var console = require('./../libs/Console');


var from = 'E:\\imgs\\1\\';
var to = 'E:\\imgs\\2\\';


async.waterfall([
	function(callback){
		var files = utils.getDirectoryStructure(from).files;
		callback(null, files);
	},
	function(files, callback){
		console.info('start to convert');
		var fls = files.slice(0);
		var loop = function(){
			if (fls.length===0){
				console.info("all the files is convert");
				return;
			}
			console.info('files: '+ fls.length);
			var file = fls.shift();
			convert(file);
			setTimeout(function(){
				loop();
			},100);
		};
		loop();
	}
]);


function convert(oldfile, cb){
	cb = cb||function(){};
	var _interface = '"F:\\ENV_PATH\\libwebp-0.4.0-windows-x64\\bin\\dwebp.exe" {{$filepath}} -o {{$newfilepath}}';
	var oldpath = from+oldfile,
		newpath = to+oldfile.split('.')[0]+'.jpg';
	var shell = utils.tpl(_interface, {
		filepath: oldpath,
		newfilepath: newpath
	});
	// console.log(shell);return;
	var ls = cp.exec(shell, {});
	ls.on('exit', function (code) {
        if (code === 0) {
            console.info('filepath:' + newpath);
        }else {
            console.error('filepath:' + pathname);
            console.error('wget shell is:' );
            console.error(shell);
        }
        cb();
    });
}

