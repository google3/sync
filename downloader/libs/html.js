/**
 * 获取图片的src属性值
 * @params html String
 */
exports.getImgsSrcFromHTML=function(html, getAttr, regx){
    getAttr = getAttr || 'src';
    // var regx = /<img\s*.*src="(\S+?)"/ig;
    var _regx = new RegExp('<img\\s*.*'+getAttr+'="(\\S+?)','ig');
    regx = regx || _regx;
    var img,ret=[];
    while ( (img=regx.exec(html)) != null ) {
        ret.push(img[1]);
    }
    return ret;
};

/**
 * 获取img标签
 * @params html String
 */
exports.getImgTagsFromHTML = function(html){
    var regx = /<img\s\S*src="(\S+?)".*?>/g;
    var ret = html.match(regx);
    return ret;
}

/**
 * 获取链接
 * @params html String
 */
exports.getLinksFromHTML = function(html){
    var regx = /<a\s\S*href="(\S+?)".+?>/g;
    var link,ret=[];
    while ( (link=regx.exec(html)) != null ) {
        ret.push(link[1]);
    }
    return ret;
}

/**
 * 获取a标签
 * @params html String
 */
exports.getATagsFromHTML = function(html){
    var regx = /<a.*?>(.*?)<\/a>/g;
    var ret = html.match(regx);
    return ret;
}

/**
 * 获取下一页a标签
 * @params html String
 */
exports.getNextPageATagsFromHTML = function(html, innerTEXT){
    innerTEXT = innerTEXT || '下一页';
    // var regx = /<a.*?><\/a>/g;
    var regx = new RegExp("<a[^><]*?>"+innerTEXT+"<\/a>",'g');
    var ret = html.match(regx);
    return ret;
}

/**
 * 获取a标签的href属性
 * @params html String
 */
exports.getHrefFromA = function(html){
    var regx = /href="(.*?)"/
    var ret = html.match(regx);
    return ret;
}