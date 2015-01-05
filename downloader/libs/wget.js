var fs = require('fs');
var utils = require('./utils');
var cp = require('child_process');
var conf = require('./config');
var async = require('async');
var console = require('./Console');

exports.download = function(opts){
    var url = opts.url || '',
        cb = opts.cb || function(){},
        pathname = opts.pathname || '';
    if (!url) {
        console.error("[error] download url is null");
        cb();
        return;
    }
    if (fs.existsSync(pathname)) {
        console.error('[TIPS][wget][File Already Exist]: ' + pathname);
        cb();
        return;
    }
    if (!pathname) {
        console.error('[ERROR][wget]pathname is null');
        cb();
        return;
    }
    async.waterfall([
        function(){
            var shell = conf.download.wget + ' -U "{{$useragent}}" "{{$url}}" -O "{{$pathname}}"';
            var shell_data = {
                useragent: conf.request.useragent,
                url: url,
                pathname: pathname
            };
            shell = utils.tpl(shell, shell_data);

            var startTime = new Date().valueOf(), endTime;
            console.info("[INFO] 正在下载：" + pathname);
            var ls = cp.exec(shell, {});
            ls.on('exit', function (code) {
                endTime = new Date().valueOf();
                if (code === 0) {
                    console.info('[download success]');
                    console.info('filepath:' + pathname);
                    console.info('use time: ' + (endTime - startTime)/1000 + '\'s');
                }else {
                    console.error('[download fail] code=' + code);
                    console.error('filepath:' + pathname);
                    console.error('wget shell is:' );
                    console.error(shell);
                }
                cb();
            });
        }
    ], function(){

    });
	
};