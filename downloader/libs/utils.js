var fs = require('fs');

exports.tpl = function(str, data){
    var reg = /\{\{\$(\w+)\}\}/g;
    var ret=str.replace(reg, function(a,b){
        return data[b];
    });
    return ret;
};

exports.mkdir = function(newpath, cb, mode){
	var fs = require('fs'),
		arr = newpath.split("\\");
    mode = mode || 0755;
    cb = cb || function(){};
    if(arr[0]==="."){
        arr.shift();
    }
    if(arr[0] == ".."){
        arr.splice(0,2,arr[0]+"/"+arr[1])
    }
    function inner(cur){
        if(!fs.existsSync(cur)){
            fs.mkdirSync(cur, mode)
        }
        if(arr.length){
            inner(cur + "/"+arr.shift());
        }else{
            cb();
        }
    }
    arr.length && inner(arr.shift());
};

exports.removeIllegalFolderChar = function(str){
    return str.replace(/[\/\\\:\*\?\"\<\>\|\s]/g, '_');
};


exports.guid = function(){
    function S4(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);   
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


exports.getDirectoryStructure=function(folderpath){
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
};