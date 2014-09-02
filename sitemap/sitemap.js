var fs=require('fs');
var cfg = {
	html_path: 'F:\\Dropbox\\blogs\\8877.github.io\\docs\\',
	host: 'https://8877.github.io/docs',
	output_path:'F:\\Dropbox\\blogs\\8877.github.io\\sitemap.txt'
};

var json=getDirectoryStructure(cfg.html_path);
var lists = [];
var loopShow=function(obj,path){
	path = path || '/'
	if(obj.files){
		obj.files.forEach(function(val, idx){
			lists.push(cfg.host + path + val);
		});
	}
	if(obj.folders){
		obj.folders.forEach(function(val, idx){
			for(var i in val){
				var _p = path + i + '/';
				loopShow(val[i], _p);
			}
		});
	}
}
loopShow(json);
fs.writeFile(cfg.output_path, lists.join('\r\n'));
console.log('**********');
console.log('爬取完成!');
console.log(cfg.output_path);
console.log('**********');


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