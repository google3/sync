(function(){


var js_store={};
js_store.css = function(){
/*
*{margin:0;padding: 0;}
pre{
	font-family: "Helvetica Neue",Helvetica,"Lucida Grande","Luxi Sans",Arial,"Hiragino Sans GB",STHeiti,"Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Micro Hei Mono","WenQuanYi Zen Hei","WenQuanYi Zen Hei Mono",LiGothicMed;
	font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
	font-size:16px;
}
ul{
	list-style:none;
	border-left: solid 1px green;
}
ul li{
	margin-left: 27px;
}
ul.hover{
	background: #dfdfdf;
}
.btn{padding-right:5px;cursor:pointer;padding:1px 3px;margin-left: -10px;color:red;}
.omit{color:gray;}
.hide{display:none;}
pre{
	background: #efefef;
	margin:10px;
	word-wrap: break-word;
	word-break: normal;
	white-space: pre-wrap;
}
.key{
	font-weight: bold;
}
.str{
	color:rgb(184,3,3);
}
.num{
	color:blue;
}
 */
};
function get_html_from_function(fn){
	var _str = fn.toString(), 
		s_pos = _str.indexOf("/*")+2, 
		e_pos = _str.lastIndexOf("*/"); 
	return (s_pos<0 || e_pos<0) ? "" : _str.substring(s_pos, e_pos); 
};

function insert_style(){
	var css_val = get_html_from_function(js_store.css);
	// console.log(css_val);
	var style = document.createElement('style');
	style.type='text/css';
	style.innerHTML = css_val;
	document.head.appendChild(style);
};

function get_js(src,callback){
	var script = document.createElement('script');
	script.src=src;
	document.body.appendChild(script);
	script.onload =script.onreadystatechange =  function(){
		if(!this.readyState||/complete|loaded/.test(this.readyState)){
		   typeof callback==='undefined' || callback.call(window);
		   this.onload = this.onreadyState = null;
		}
	}
};

function out_blank(num){
	return '';
	var ret=[];
	while(num>0){
		ret.push('    ');
		num --;
	}
	return ret.join('');
}

function escape_html(str){
	if(typeof str==='string'){
		var reg = /^https?:\/\/.*$/;
		str = str.replace(/</g,'&lt;').replace(/>/g,'&gt;')
		if(reg.test(str)){
			str = '<a href="'+str+'" target="_blank">' + str + '</a>';
		}
	}
	return str;
}

function _re_val(val){
	if(typeof val==='number'){
		return '<span class="num">' + escape_html(val) + '</span>';
	}else if(typeof val==='string'){
		return '<span class="str">"' + escape_html(val) + '"</span>';
	}
}

function bueatify(data){
	var html = [];
	var deep=0;
	var b_object = function(obj, deep, _html){
		deep ++;
		var obj_len=0;
		for(var i in obj){
			obj_len++;
		}
		var cur_index = 0;
		var is_last;
		for(var i in obj){
			cur_index++;
			is_last = cur_index===obj_len?true:false
			var col = obj[i];
			if($.isArray(col)){
				_html.push([
					'<li>',
					out_blank(deep),
					'<span class="btn">-</span>',
					'"',
					'<span class="key">'+escape_html(i)+'</span>',
					'": ',
					'<span class="mark_s">[</span>',
					'<span class="omit">...]</span>',
					b_array(col, deep, []),
					out_blank(deep),
					'<span class="mark_e">]</span>',
					(is_last?'':'<span class="comma">,</span>'),
					'</li>'
				].join(''));
			}else if(typeof col==='object'&&col&&col.constructor===Object){
				_html.push([
					'<li>',
					out_blank(deep),
					'<span class="btn">-</span>',
					'"',
					'<span class="key">'+escape_html(i)+'</span>',
					'": ',
					'<span class="mark_s">{</span>',
					'<span class="omit">...}</span>',
					b_object(col, deep, []),
					out_blank(deep),
					'<span class="mark_e">}</span>',
					(is_last?'':'<span class="comma">,</span>'),
					'</li>'
				].join(''));
			}else if(typeof col==='string'||typeof col==='number'){
				_html.push([
					'<li>',
					out_blank(deep),
					'"',
					'<span class="key">'+escape_html(i)+'</span>',
					'": ',
					_re_val(col),
					(is_last?'':','),
					'</li>'
				].join(''));
			}
		}
		return [
			'<ul>',
			_html.join(''),
			'</ul>'
		].join('')
	};
	var b_array = function(arr, deep,_html){
		deep++;
		var len = arr.length;
		var is_last;
		$(arr).each(function(index, val){
			is_last = len===(index+1);
			if($.isArray(val)){
				_html.push([
					'<li>',
					out_blank(deep),
					'<span class="btn">-</span>',
					'<span class="mark_s">[</span>',
					'<span class="omit">...]</span>',
					b_array(val, deep, []),
					out_blank(deep),
					'<span class="mark_e">]</span>',
					(is_last?'':'<span class="comma">,</span>'),
					'</li>'
				].join(''));
			}else if(typeof val==='object'&&val&&val.constructor===Object){
				_html.push([
					'<li>',
					out_blank(deep),
					'<span class="btn">-</span>',
					'<span class="mark_s">{</span>',
					'<span class="omit">...}</span>',
					b_object(val, deep, []),
					out_blank(deep),
					'<span class="mark_e">}</span>',
					(is_last?'':'<span class="comma">,</span>'),
					'</li>'
				].join(''));
			}else if(typeof val==='string'||typeof val==='number'){
				// html.push(out_blank(deep)+(escape_html(val))+(is_last?'':',')+'\n');
				_html.push([
					'<li>',
					out_blank(deep),
					_re_val(val),
					(is_last?'':'<span class="comma">,</span>'),
					'</li>'
				].join(''));
			}
		});
		return [
			'<ul>',
			_html.join(''),
			'</ul>'
		].join('')
	};
	if(typeof data==='object' && data.constructor===Object){
		// html.push(out_blank(deep)+'{\n');
		var ss=[
			'<li>',
			out_blank(deep),
			'<span class="btn">-</span>',
			fn_start+'{',
			'<span class="omit">...}'+fn_end+'</span>',
			b_object(data,0,[]),
			out_blank(deep),
			'<span class="mark_e">}'+fn_end+'</span>',
			'</li>'
		].join('');
		return '<ul>' + ss + '</ul>';
		// html.push(out_blank(deep)+'}\n');
	}
	// return html.join('');
}

function add_event(){
	$('.omit').addClass('hide');
	$('.btn').click(function(e){
		var tar = e.target;
		var $ul = $(tar).siblings('ul');
		var $omit= $(tar).siblings('.omit');
		var $m_e = $(tar).siblings('.mark_e');
		var $comma = $(tar).siblings('.comma');
		if($ul.is(':visible')){
			$ul.addClass('hide');
			$omit.removeClass('hide');
			$m_e.addClass('hide');
			$comma.addClass('hide');
			$(tar).html('+');
		}else{
			$ul.removeClass('hide');
			$omit.addClass('hide');
			$m_e.removeClass('hide');
			$comma.removeClass('hide');
			$(tar).html('-');
		}

	});
	$('ul').mouseenter(function(e){
		var tar = e.target;
		if(tar.nodeName.toLowerCase()!=='li'){
			return;
		}
		$('ul').removeClass('hover');
		$(tar).parent('ul').addClass('hover');
	});
}

function init(data){
	var show=function(){
		document.write([
			'<pre>',
			bueatify(data),
			'</pre>'
		].join(''));
	};
	var jq_cnd = 'https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js';
	jq_cnd = 'http://mat1.gtimg.com/app/opent/js/jquery-1.4.3.min.js';
	get_js(jq_cnd, function(){
		show();
		insert_style();
		add_event();
	});
}

var str_html;
var pre = document.querySelectorAll('pre');
if(pre && pre.length===1){
	str_html = pre[0].innerHTML;
	// console.log(pre);
}else{
	// str_html = document.body.innerHTML;
}

if(str_html){
	var reg = /.*?(\{[\s\S]+\})/;
	reg=/(.*?)(\{[\s\S]+\})(\);?)?/;
	if(reg.test(str_html)){
		// debugger
		var mch = RegExp.$2;
		var fn_start = RegExp.$1;
		var fn_end = RegExp.$3;
		fn_start = fn_start || '';
		fn_end = fn_end || '';
		// console.log(mch);
		try{
			var json = JSON.parse(mch);
			init(json);
		}catch(e){
			console.log(e);
		}
	}
}

})();
