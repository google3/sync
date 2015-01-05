var fs = require('fs');
var _config={};
var data = fs.readFileSync(__dirname + '/../conf/config.conf', 'utf-8');
var conf = {}, 
	match_key,
	match_val,
	key,
	valStr,
	val,
	Reg_key = /(\s*\[\w+\]\s\n)([^\[\]]+)/g,
	Reg_val = /\s*(\w+)\s*=\s*([^\n]+)/g;

// 删除注释
data = data.replace(/\s*#[^\n]+/g,'');

// 第一步： 匹配 [proxy], [download] 的区块
while( (match_key=Reg_key.exec(data)) != null) {
	if (match_key && match_key.length > 2) {
		var key = match_key[1].replace(/[\[\]\r\n\s]/g,''), 
			valStr = match_key[2],
			val = {};
		// 第二步： 匹配 path = E:\Downloads\ 的值
		while( (match_val=Reg_val.exec(valStr)) !=null ){
			if (match_val && match_val.length>2) {
				val[match_val[1]] = match_val[2].replace(/\r/g,'');
			}
		}
		conf[key] = val;
	}
}

module.exports = conf;