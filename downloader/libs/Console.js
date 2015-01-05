var colors = require( "colors");

var _exports = {};
for (var i in console){
	_exports[i] = console[i];
}

_exports.log = function(txt){
	if (typeof txt==='string') {
		console.log(txt.bold);	
	}else{
		console.log(txt);
	}
};

_exports.error = function(txt){
	if (typeof txt==='string') {
		console.error(txt.red);	
	}else{
		console.error(txt);
	}
	
};
_exports.warn = function(txt){
	if (typeof txt==='string') {
		console.warn(txt.yellow);	
	}else{
		console.warn(txt);
	}
	
};
_exports.info = function(txt){
	if (typeof txt==='string') {
		console.info(txt.green);	
	}else{
		console.info(txt);
	}
};


module.exports = _exports;