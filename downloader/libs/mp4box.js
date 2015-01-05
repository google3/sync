var utils = require('./utils');
var cp = require('child_process');
var fs = require('fs');
var conf = require('./config');
var async = require('async');
var console = require('./Console');

/**
 * 合并mp4
 * @param  {Array}   paths 需要合并的文件路径列表
 * @param  {String}   to   合并后的文件名+路径
 * @param  {Function} cb   回调
 */
exports.concatMP4 = function (paths, to, cb) {
	cb = cb || function(){};
    if (paths && paths.length < 2) {
        console.error('[ERROR][mp4box]');
        console.error('paths is only one value:');
        console.error();
        cb(false);
        return;
    }
    if (fs.existsSync(to)) {
    	console.log('[mp4box error]: ' + to + ' allready isexists!');
        cb(false);
    	return;
    }
    async.waterfall([
        function(){
            console.log('##############  mp4box  doing  ##############');
            // mp4box -cat 1.mp4 -cat 2.mp4 -new hahaha.mp4
            var shell_tpl = '"'+conf.concat.mp4box+'"' + '{{$files}} -new {{$newpath}}';
            var shell_data = {
                files: ' -cat ' + paths.join(' -cat '),
                newpath: to
            };
            var shell = utils.tpl(shell_tpl, shell_data);
            var start_concat = new Date().valueOf(), end_concat;
            console.log(shell);
            // return;

            var ls = cp.exec(shell, {});
            var processInfo;
            var timer = setInterval(function(){
                console.log('[mp4box info]: ' + processInfo);
            }, 1000);
            var clear = function(){
                clearInterval(timer);
            };

            ls.stdout.on('data', function (data) {
                processInfo = data;
            });

            ls.on('exit', function (code, a, b) {
                console.log('##############  mp4box  end  ##############');
                end_concat = new Date().valueOf();
                clear();
                if (code===0) {
                    console.log('[mp4box success]\n[create]'+ to +' is created;\n[timing]used:' + (end_concat - start_concat)/1000 + '\'s' );
                    cb(true);
                }else {
                    console.log('[mp4box fail]');
                    cb();
                }
            });
        }
    ], function(){

    });
};