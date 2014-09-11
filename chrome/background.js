/**
 * 注册标签页更新时的事件
 * 这里调用了initialize()事件，把func.js注入当前标签页中 
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // alert('tab update:'+tabId);
    initialize(tabId);
    listen_msg(tabId);
});

/**
 * 初始化方法 ，注入func.js事件
 * @param {Object} tabId
 */
function initialize(tabId){
    chrome.tabs.executeScript(tabId, {file: "js/func.js", allFrames: false});
    // chrome.tabs.executeScript(tabId, {file: "js/bueatify_json.js", allFrames: false});
}

function listen_msg(tabId){
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		console.log(request,sender, sendResponse);
		chrome.tabs.executeScript(tabId, {file: "js/txv_tools.js", allFrames: true});
	});
}