var fs=require('fs');
var cfg = {
	html_path: 'F:\\Dropbox\\blogs\\8877.github.io\\docs\\',
	host: 'https://8877.github.io/docs',
	output_path:'F:\\Dropbox\\blogs\\8877.github.io\\index.html'
};
var maps = {
	css: "重叠样式表",
	java: "Java编程",
	js: "Javascript编程",
	pc: "电脑百科",
  cookbook: '饮食',
  classic:'经典名言',
  photo: '摄影'
};

var json=getDirectoryStructure(cfg.html_path);
var lists = [];
var loopShow=function(obj,path){
	path = path || '/'
	if(obj.files){
		obj.files.forEach(function(val, idx){
      if(/\.html$/.test(val)){
        lists.push(path + val);
      }
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

var title_url = {};
lists.forEach(function(val, idx){
	console.log(val);
	var html = fs.readFileSync( cfg.html_path + val, 'utf-8');
	var reg = /<title>(.+)<\/title>/g;
	if(reg.test(html)){
		var title = RegExp.$1;
		var type = get_sort_from_path(val);
		if(title_url.hasOwnProperty(type)){
			title_url[type].push([title, val]);
		}else{
			title_url[type] = [[title, val]]
		}
	}
});

// console.log(title_url);
var html_str = output_html(title_url);
html_str = tpl( get_html_from_function(store_html), {
	title: '8877离线文档',
	content: html_str
});
fs.writeFile(cfg.output_path, html_str);
console.log('**********');
console.log('爬取完成!');
console.log('**********');

function output_html(json){
	var html = ["<div class='list_wrapper'>"];
	for(var i in json){
		html.push("<div class='list_inner'>");
		html.push("<h2>" + (maps[i] || i) + "</h2>");
		html.push("<ul>");
		json[i].slice(0,5).forEach(function(val, idx){
			html.push("<li><a href='"+cfg.host+val[1]+"'>"+val[0]+"</a></li>");
		});
		html.push("</ul>");
		html.push("</div>");
	}
	html.push("</div>");
	return html.join('');
}


function store_html(){
/*
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>{{$title}}</title>
<style type="text/css">
*{margin:0;padding:0;}
body{
	font-family:"Helvetica Neue",Helvetica,"Lucida Grande","Luxi Sans",Arial,"Hiragino Sans GB",STHeiti,"Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Micro Hei Mono","WenQuanYi Zen Hei","WenQuanYi Zen Hei Mono",LiGothicMed;
	padding: 5px 10px;
	font-size: 16px;
}
.header_title{
	font-size: 23px;
	text-align: center;
}
img{
	max-width: 100%;
	display: block;
}
ul{
	list-style: none;
	margin-top: 5px;
}
ul li{
	border-bottom: solid 1px #ddd;
	padding: 10px 0;
	display: block;
}
ul li a{
	text-decoration: none;
	color:#333;
}
.list_inner h2{
  padding:10px 0;
	border-bottom: solid 2px #000;
  font-size:18px;
}
.list_inner:nth-child(1) h2{
	color:#14A34A;
	border-bottom-color:#14A34A;
}
.list_inner:nth-child(2) h2{
	color:#E2862B;
	border-bottom-color:#E2862B;
}
.list_inner:nth-child(3) h2{
	color:#9395B7;
	border-bottom-color:#9395B7;
}
.list_inner:nth-child(4) h2{
	color:#C68D76;
	border-bottom-color:#C68D76;
}
.list_inner:nth-child(5) h2{
	color:#7b0053;
	border-bottom-color:#7b0053;
}
.list_inner:nth-child(6) h2{
	color:#A922E1;
	border-bottom-color:#A922E1;
}
@media (min-width: 1200px) {
	body{
		max-width: 1200px;
		margin:0 auto;
	}
}
</style>
</head>
<body>
<h1 class="header_title">8877离线文档</h1>
{{$content}}
<div style="display:none;">
<script type="text/javascript">
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F7a6b06e35781e7b430b26e5a9ef972a8' type='text/javascript'%3E%3C/script%3E"));
</script>
</div>
</body>
</html>
*/
}

function tpl(str,data){
    var reg = /\{\{\$(\w+)\}\}/g;
    var ret=str.replace(reg, function(a,b){
        return data[b];
    });
    return ret;
}

function get_html_from_function(fn){
	var _str = fn.toString(), 
		s_pos = _str.indexOf("/*")+2, 
		e_pos = _str.lastIndexOf("*/"); 
	return (s_pos<0 || e_pos<0) ? "" : _str.substring(s_pos, e_pos); 
}

function get_sort_from_path(path){
	var _slice = path.split('\/');
	return _slice[1];
}

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
