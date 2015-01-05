var utils = require('./utils');
var cp = require('child_process');
var fs = require('fs');
var conf = require('./config');
var async = require('async');


exports.concatFlv = function (paths, to, cb) {
	cb = cb || function(){};
    if (paths && paths.length < 2) {
        cb(false);
        return;
    }
    if (fs.existsSync(to)) {
    	console.log('[concatFlv error]: ' + to + ' allready isexists!');
        cb(false);
    	return;
    }
    async.waterfall([
        function(){
            // mp4box -cat 1.mp4 -cat 2.mp4 -new hahaha.mp4
            var shell_tpl = 'copy /b {{$files}} {{$newpath}}';
            var shell_data = {
                files: paths.join('+'),
                newpath: to
            };
            var shell = utils.tpl(shell_tpl, shell_data);
            var start_concat = new Date().valueOf(), end_concat;
            console.log(shell);
            // return;

            var ls = cp.exec(shell, {});
            var processInfo;
            var timer = setInterval(function(){
                console.log('[concatFlv info]: ' + processInfo);
            }, 1000);
            var clear = function(){
                clearInterval(timer);
            };
            ls.stdout.on('data', function (data) {
                processInfo = data;
            });

            ls.on('exit', function (code, a, b) {
                end_concat = new Date().valueOf();
                clear();
                if (code===0) {
                    console.log('[concatFlv success] used:' + (end_concat - start_concat)/1000 + '\'s' );
                    cb(true);
                }else {
                    console.log('[concatFlv fail]');
                    cb();
                }
            });
        }
    ], function(){

    });
};