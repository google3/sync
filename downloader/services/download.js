var fs = require('fs');
var dl = require('./../libs/download').loopDownload;
var flv = require('./../libs/concatFlv');
var mp4box = require('./../libs/mp4box');
var async = require('async');
var conf = require('./../libs/config');

var files = [];
/**
 * 执行下载
 * @param  {[type]}   videoConf [description]
 * @param  {Function} cb        [description]
 * @return {[type]}             [description]
 */
function download(videoConf, cb){
	async.waterfall([
		function (callback){
			dl(videoConf, function(_files){
				files = _files;
				callback(null);
			});
		},
		function(callback){
			var to = videoConf.filepath + videoConf.title + videoConf.postfix;
			if (fs.existsSync(to)) {
				console.log('[concat files TIPS]: ' + to + ' is already exist;');
				callback(null,0);
				return;
			}
	    	if (videoConf.postfix==='.mp4') {
	    		mp4box.concatMP4(files, to, function (needDel){
		    		callback(null, needDel);
		    	});
	    	} else if (videoConf.postfix==='.flv') {
	    		console.info('下载完成，请手动合并flv！');return;
	    		flv.concatFlv(files, to, function (needDel){
		    		callback(null, needDel);
		    	});
	    	} else {
	    		cb();
	    	}
		},
		function (args1, callback){
			var cleanUp = conf.concat.deleteSlice;
			var fileCount = files.length;
	    	if ( cleanUp === 'true' && fileCount!==1 && args1 ) {
				files.forEach(function(val, index){
			        fs.unlinkSync(val);
			    });
			    console.log('[TIPS] success to del (' + fileCount + ') files;');
	    	}
		    cb();
		},
	], function(){

	});
}

exports.dl = download;