var handlers = {
	redirect_to: function(page){
		var url = location.href.replace(location.pathname, "/"+page);
    	window.open(url);
	},
	go_my_blog: function(){
		window.open('http://blog.zobor.me/');
	},
	go_css3_border: function(){
		var filepath = 'tools/css3_border_radius/index.html';
		this.redirect_to(filepath);
	}
};
document.getElementById('check_page').addEventListener('click',function(){
	chrome.extension.sendRequest('hahahahahahaha', function(data) {});
},false);
document.getElementById('about').addEventListener('click',function(){
	handlers.go_my_blog();
},false);
document.getElementById('css3_radius').addEventListener('click',function(){
	handlers.go_css3_border();
},false);




// chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
// 	console.log(request, sender, sendResponse);
// });