// request 代理设置
var r = require('request');
var fs = require('fs');
r = r.defaults({'proxy':'http://proxy.tencent.com:8080'});
var cp = require('child_process');



var url='http://data.video.qq.com/fcgi-bin/cover/video_list?cid=5p1hg6slyf5vewz&otype=json&page_no=1&page_size=50&platform=12&version=90000&type=video&fields=,vid,episode,trailer&rand=1395641903';


var INFO = {
    tvname: '我的儿子是奇葩',
    urls: '',
    vid: '',
    folder: 'youku',
    startTime:'',
    endTime:'',
    count: 0,
    concatProcess:'',
    timer:null,
    postfix: '.mp4'
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
        var url_part = urls.pop();
        var url = url_part.url;
        var name = url_part.name;
        console.log(url, name);
        // var tvname = '';
        // console.log(INFO.folder + '\/aaa' + '\/' + name + INFO.postfix );
        var shell = 'wget -U "{{$useragent}}" "{{$url}}" -O "{{$pname}}"';
        var shell_data = {
            useragent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.146 Safari/537.36",
            url: url,
            pname: INFO.folder + '/aaa' + '/' + name + INFO.postfix
        };
        console.log(shell_data);

        shell = util.tpl(shell, shell_data);
        console.log(shell);
        var ls = cp.exec(shell, {});
        ls.on('exit', function (code) {
            console.log('****** finished: ' + (INFO.urls.length-urls.length) + '/' + INFO.urls.length + ' ******');
            util.download(urls, cb);
        });
    },
    
    
    
};



var v = [];
var info = {};

r(url, function (error, response, body) {
	var str = body.replace('QZOutputJson=','').replace(/;$/,'');
	var data = JSON.parse(str);
	info.urls = data.videos;
	getUrl(data.videos.slice(0));
});

function getUrl(lists){
	if (lists.length===0){
		console.log('get url done!');
		// console.log(v);
		util.download(v.slice(0),function (){
			console.log('finished download all!');
		});
		return;
	}
	var vid = lists.shift().vid;
	var url = 'http://vv.video.qq.com/geturl?otype=json&vid=' + vid;
	r(url, function(error, response, body){
		var str = body.replace('QZOutputJson=','').replace(/;$/,'');
		var data = JSON.parse(str);
		v.push({
			name: info.urls.length - lists.length,
			url: data.vd.vi[0].url
		});
		// lists = [];
		getUrl(lists);
	});
}
