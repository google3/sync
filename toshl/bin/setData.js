var fs = require('fs');
fs.readFile('data.csv', 'utf-8', function(err, data){
	if(err){
		console.log(err);
		return;
	}
	if(!data){
		console.log('data is empty');
		return;
	}
	var list = data.split('\n');
	var db = [];
	list.shift();
	// console.log(list.length);
	list.forEach(function(val, idx){
		var line = val.split(',');
		// if(line && line.length!==6) return;
		if(line[0] && line[1] && line[2]){
	db.push({
				date: trimQuote(line[0]),
				tag: trimQuote(line[1]),
				rmb: trimQuote(line[2]),
				desc: trimQuote(line[5])
			});
		}
		
	});
	console.log(db);
	var expText = 'var db=' + JSON.stringify(db);
	fs.writeFile('../chart/db.js', expText);
});


function trimQuote(str){
	if(!str) return str;
	return str.replace(/['"]/g,"");
}