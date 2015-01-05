var INFO = {
    title: '',
    urls: '',
    vid: '',
    folder: 'youku',
    startTime:'',
    endTime:'',
    count: 0,
    concatProcess:'',
    timer:null,
    postfix: ''
};

var tools = {
    'wget': '"tools/wget/wget.exe"',
    'mp4box': '"tools/mp4box/mp4box.exe"'
};

var youku = {
    getVideoInfoByVID: function(vid, cb){
        var _interface = 'https://openapi.youku.com/v2/videos/show_basic.json?video_id={{$vid}}&client_id=b10ab8588528b1b1';
        var url = util.tpl(_interface, {vid: vid});
        r(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                if (!data.title) {
                    console.log(data.error.description);
                    return;
                }
                INFO.title = util.removeIllegalChar(data.title);
                cb();
            }else {
                console.log('http ' + response.statusCode + ' ' + error);
            }
        });
    },
    getVideoList: function(vid, cb){
        var _interface = 'http://f.youku.com/player/getFlvPath/sid/139461565323405_03/st/mp4/fileid/0300080D02531891F2BD1C04B921BFCDD245C9-DD78-D007-F82E-FCB7919055F3?K=efe8ba860eaf23912411bbc3&hd=1&ts=406&ctype=40';

        _interface = 'http://m.youku.com/wireless_api3/videos/{{$vid}}/playurl?format=1,2,4,5,6';
        var url = util.tpl(_interface, {vid: vid});
        // console.log(url);
        r(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                // var urls = data.results.mp4;
                // console.log(data);
                try {
                    INFO.urls = data.results.mp4;
                    INFO.postfix = '.mp4';
                    if (!INFO.urls.length) {
                        INFO.urls = data.results.flvhd;
                        INFO.postfix = '.flv';
                    }
                    cb();
                } catch(e){
                    console.log("获取下载地址失败!");
                }
            }
        });
    }
};

var util = {
    tpl: function(str, data){
        var reg = /\{\{\$(\w+)\}\}/g;
        var ret=str.replace(reg, function(a,b){
            return data[b];
        });
        return ret;
    },
    newFilder: function(path, cb){
        try {
            fs.mkdirSync(INFO.folder, 0755);
            console.log(INFO.folder + '已创建');
        } catch(e){
            console.log(INFO.folder + '已存在');
        }
        try {
            fs.mkdirSync(INFO.folder + '/' + path, 0755);
            cb();
        } catch(e){
            console.log(e);
        }
    },
    removeIllegalChar: function(str){
        return str.replace(/[\/\\\:\*\?\"\<\>\|\s]/g, '_');
    },
    download: function(urls, cb){
        if (urls.length ===0) {
            INFO.endTime = new Date().valueOf();
            console.log("#########################");
            console.log("download fininshed");
            console.log("within time: " + (INFO.endTime-INFO.startTime)/1000 + " s");
            console.log("#########################");
            cb();
            return ;
        }
        var url = urls.pop().url;
        var shell = tools.wget + ' -U "{{$useragent}}" "{{$url}}" -O "{{$pathname}}"';
        var shell_data = {
            useragent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.146 Safari/537.36",
            url: url,
            pathname: INFO.folder + '/' + INFO.title + '/' +(urls.length+1)+INFO.postfix
        };

        shell = util.tpl(shell, shell_data);
        // console.log(shell);
        var ls = cp.exec(shell, {}/*options, [optional]*/);
        ls.on('exit', function (code) {
            // console.log('[OK]download: ' + url + '[code:'+code+']');
            console.log('****** finished: ' + (INFO.urls.length-urls.length) + '/' + INFO.urls.length + ' ******');
            util.download(urls, cb);
        });
    },
    getDirectoryStructure: function(folderpath){
        var json = {};
        var search=function(path,obj){
            // console.log(path);
            var _files=fs.readdirSync(path);
            // console.log(_files);
            _files.forEach(function(file){
                var pathname = path+'\\'+file,
                stat = fs.lstatSync(pathname);
                // console.log(pathname);
                // console.log(stat);

                if (stat.isDirectory()){
                    // console.log('$$$');
                    obj[file] = search(pathname, (obj[file]||{}));
                }else{
                    if(obj.constructor===Object) obj=[];
                    obj.push(file);
                    // console.log('obj= '+obj);
                }
            });
            return obj;
        };
        json = search(folderpath,json);
        if (json.constructor === Object) {
            json = [];
        }
        return json;
    },
    getVideosPath: function(arr){
        // console.log('&&&&&&&&&&&&&&&');
        // console.log(arr);
        var ret = [];
        var ISVIDEO = new RegExp('\\d+\\'+INFO.postfix,'i');
        // console.log('\\d+\\'+INFO.postfix);
        arr.sort(function(a, b){
            var a_num = a.replace(INFO.postfix),
                b_num = b.replace(INFO.postfix);
            return parseInt(a_num, 10) - parseInt(b_num, 10);
        });
        arr.forEach(function(val, index){
            // console.log(val);
            // console.log(ISVIDEO.test(val));
            if (ISVIDEO.test(val)) {
                ret.push(INFO.folder + '/' + INFO.title + '/' +val);
            }
        });
        // console.log(ret);
        // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        return ret;
    },
    concatMP4: function(filenames, cb){
        cb = cb || function(){};
        if (filenames && filenames.length < 2) {
            clearInterval(INFO.timer);
            return;
        }
        console.log('****** start concat files '+INFO.title+' ******');
        // mp4box -cat 1.mp4 -cat 2.mp4 -new hahaha.mp4
        var shell_tpl = tools.mp4box + ' {{$files_cat}} -new {{$filename}}'+INFO.postfix;
        var files_cat = '-cat ' + filenames.join(' -cat ');
        var fname = INFO.title || 'download_full_ok';
        fname = INFO.folder + '/' + INFO.title + '/' + fname;
        var shell = util.tpl(shell_tpl, {files_cat: files_cat, filename: fname});
        var start_concat = new Date().valueOf(), end_concat;
        console.log(shell);

        var ls = cp.exec(shell, {});
        ls.stdout.on('data', function (data) {
            INFO.concatProcess = data;
        });
        ls.on('exit', function (code) {
            end_concat = new Date().valueOf();
            console.log("#########################");
            console.log('[OK]concat '+ INFO.title +'.mp4 finished! [code]:' + code);
            console.log("within the time: " + (end_concat-start_concat)/1000 + " s") ;
            console.log("#########################");
            cb();
        });
    },
    startCount: function(){
        INFO.timer = setInterval(function(){
            INFO.count += 1;
            console.log('合并进度: ' + INFO.concatProcess);
            // console.log('INFO.count= ' + INFO.count);
        },1000);
    }
};


// request 代理设置
var r = require('request');
var fs = require('fs');
r = r.defaults({'proxy':'http://proxy.tencent.com:8080'});
var cp = require('child_process');
init();

function init(){
    fs.readFile('url.txt', 'utf-8', function(err, data){
        if (err) {
            console.log(err);
            return;
        }
        var VID_REG = /id_(\w+)\.html/;
        var ret = data.match(VID_REG);
        if (!ret || !ret.length) {
            console.log('url解析失败，确认url为视频播放页面');
        } else if (ret.length===2){
            INFO.vid = ret[1];
            start();
        } else {
            console.log('ERROR');
        }
    });
}

// start
function start(){
    INFO.startTime = new Date().valueOf();
    youku.getVideoInfoByVID(INFO.vid, function(){
        util.newFilder(INFO.title, function(){
            youku.getVideoList(INFO.vid, function(){
                util.download(INFO.urls.slice(0), function(){
                    console.log('下载完成，开始合并!');
                    if (INFO.postfix!=='.mp4'){
                        console.log('非mp4格式，请手动合并');
                        return;
                    }
                    util.startCount();
                    concatFiles(function(){
                        var files = util.getVideosPath( util.getDirectoryStructure(INFO.folder + '/' + INFO.title + '/') );
                        // console.log(files);
                        del_pice_mp4(files);
                    });
                });
            });
        });
    });
}


function concatFiles(cb){
    cb = cb || function(){};
    var files = util.getVideosPath( util.getDirectoryStructure(INFO.folder + '/' + INFO.title + '/') );
    // console.log(util.getDirectoryStructure(INFO.folder + '/' + INFO.title + '/'));
    // console.log(INFO.folder + '/' + INFO.title + '/');
    // console.log(files);
    util.concatMP4(files, cb);
}



function del_pice_mp4(arrs){
    arrs.forEach(function(val, index){
        fs.unlinkSync(val);
        clearInterval(INFO.timer);
    });
}





// function concatInFolder(paths){
//     if (paths.length===0) {
//         console.log('ok');
//         return ;
//     }
//     var path = paths.pop();
//     // console.log(path);
//     INFO.title = path.split('/')[1];

//     var files = util.getVideosPath( util.getDirectoryStructure(path) );
//     // console.log(files);return;
//     util.concatMP4(files, function(){
//         concatInFolder(paths);
//     });
// }

// // autoConcat();
// function autoConcat(){
//     var files = util.getDirectoryStructure(INFO.folder + '/' );
//     var folders = [];
//     for (var i in files){
//         folders.push(INFO.folder + '/' + i);
//     }
//     console.log(folders);
//     concatInFolder(folders);
// }
