var fs=require('fs');
var console = require('./../libs/Console');

var path = 'C:\\Users\\zoborzhang\\Downloads\\';

var a = getDirectoryStructure(path);
a.files.forEach(function(val, index){
	if(val.indexOf('.mp4')!==-1){
		var p = path + val;
		var p2 = path + decodeURI(val);
		fs.rename(p,p2);
	}
});
// console.log(a);

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