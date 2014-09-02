var fs = require('fs');
var r = require('./libs/request.js').request;
var proxy = process.env.http_proxy;
if (proxy){
    r.default({proxy: proxy});
}
var db_path = __dirname+'/./db.json';

function get_at_from_url(url, cb){
  console.log('tag is:' + tag);
  console.log('request url:' + url);
  r.get(url, function(body, hd){
    cb(body);
  });
}
function regx_get_at( html ){
    var regx = /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)+/g;
    var ret = html.match(regx);
    return ret;
}
function get_json(){
  if(!fs.existsSync(db_path)){
    fs.writeFileSync(db_path, '{}');
  }
  var str = fs.readFileSync(db_path,'utf-8');
  if(!str || !/\w+/.test(str)){
    str = '{}';
  }
  var data = JSON.parse(str);
  return data;
}
function set_json(arr, cb){
  var data=get_json();
  if(!data.hasOwnProperty(tag)){
    data[tag] = {};
  }
  arr.forEach(function(val, idx){
    data[tag][val]=null;
  });
  fs.writeFileSync(db_path, JSON.stringify(data));
  cb();
}


// var url = 'http://www.douban.com/group/topic/26811300/';
// var tag = '建筑';

// var url = 'http://www.douban.com/group/topic/43050138/';
// var tag = '宜家目录手册';

// var url = 'http://www.douban.com/group/topic/47418311/';
// var tag = '手绘POP';

// var url = 'http://www.douban.com/group/topic/52600206/';
// var tag = '城市规划';

var url, tag;
var list = [
  // { url: 'http://www.douban.com/group/topic/26811300/', tag: '建筑' },
  // { url: 'http://www.douban.com/group/topic/43050138/', tag: '宜家目录手册' },
  // { url: 'http://www.douban.com/group/topic/47418311/', tag: '手绘POP' },
  // { url: 'http://www.douban.com/group/topic/52600206/', tag: '城市规划' },
  // { url: 'http://www.douban.com/group/topic/51149146/', tag: 'AI广告' },
  // { url: 'http://www.douban.com/group/topic/20911643/', tag: '乌镇攻略' },
  // { url: 'http://www.douban.com/group/topic/47485431/', tag: '摄影技巧' },
  // { url: 'http://www.douban.com/group/topic/46041386/', tag: '电子书' },
  // { url: 'http://www.douban.com/group/topic/47447766/', tag: '时间管理' },
  // { url: 'http://www.douban.com/group/topic/52795867/', tag: '个性字体' },
  // { url: 'http://www.douban.com/group/topic/43625063/', tag: 'C语言' },
  // { url: 'http://www.douban.com/group/topic/43059314/', tag: '吉他技巧' },
  // { url: 'http://www.douban.com/group/topic/52377581/', tag: '德语网络课程' },
  // { url: 'http://www.douban.com/group/topic/43076937/', tag: '高清电影' },
  // { url: 'http://www.douban.com/group/topic/49093935/', tag: '水彩教程' },
  // { url: 'http://www.douban.com/group/topic/53467634/', tag: 'ESL learning guide' },
  // { url: 'http://www.douban.com/group/topic/53270481/', tag: '心理学' },
  // { url: 'http://www.douban.com/group/topic/30887834/', tag: '壁纸' },
  // { url: 'http://www.douban.com/group/topic/21469186/', tag: '无' },
  // { url: 'http://www.douban.com/group/topic/52384976/', tag: '图书' },
  // { url: 'http://site.douban.com/173135/widget/forum/9630362/discussion/48292571/?start=300', tag: '减肥' },
  // { url: 'http://site.douban.com/in3/widget/forum/423941/discussion/49178786/', tag: '歌曲' },
  // { url: 'http://tieba.baidu.com/p/2728995209', tag: '小说' },
  // { url: 'http://bbs.tianya.cn/post-144-611741-1.shtml', tag: '一级建造师' },
  // { url: 'http://bbs.eduu.com/thread-2768927-1-1.html', tag: '初中文言文' },
  // { url: 'http://tieba.baidu.com/p/310514257', tag: 'C#邮件群发' },
  // { url: 'http://bbs.tl.changyou.com/forum.php?mod=viewthread&tid=31540366', tag: '龙门镖局' },
  // { url: 'http://bbs.esnai.com/thread-4940447-1-1.html', tag: 'P段网课' },
  // { url: 'http://tieba.baidu.com/p/738057523', tag: '北京故事' },
  // { url: 'http://bbs.tiexue.net/post_6642834_1.html', tag: '刘亦菲图片' },
  // { url: 'http://bbs.18183.com/thread-1652989-1-1.html', tag: '白虎礼包' },
  // { url: 'http://tieba.baidu.com/p/2911538680?pn=2', tag: '微信透明玻璃' },
  // { url: 'http://tieba.baidu.com/p/2911538680?pn=3', tag: '微信透明玻璃' },
  // { url: 'http://tieba.baidu.com/p/2911538680?pn=4', tag: '微信透明玻璃' },
  // { url: 'http://tieba.baidu.com/p/2911538680?pn=5', tag: '微信透明玻璃' },
  // { url: 'http://tieba.baidu.com/p/2911538680?pn=6', tag: '微信透明玻璃' },
  // { url: 'http://tieba.baidu.com/p/2911538680?pn=7', tag: '微信透明玻璃' },
  // { url: 'http://tieba.baidu.com/p/2911538680?pn=8', tag: '微信透明玻璃' },
  // { url: 'http://bbs.tianya.cn/post-152-713492-1.shtml', tag: '微信营销' },
  // { url: 'http://www.douban.com/group/topic/44592777/', tag: '微信群交流哟' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=0', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=100', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=200', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=300', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=400', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=500', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=600', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=700', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=800', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=900', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=1000', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=1100', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=1200', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=1300', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=1400', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=1500', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=1600', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/44176014/?start=1700', tag: 'PS海报' },
  // { url: 'http://www.douban.com/group/topic/43077965/?start=400', tag: '运动常识' },
  // { url: 'http://www.douban.com/group/topic/43077965/?start=300', tag: '运动常识' },
  // { url: 'http://www.douban.com/group/topic/43077965/?start=200', tag: '运动常识' },
  // { url: 'http://www.douban.com/group/topic/43077965/?start=100', tag: '运动常识' },
  // { url: 'http://www.douban.com/group/topic/43077965/?start=0', tag: '运动常识' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=1500', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=1400', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=1300', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=1200', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=1100', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=1000', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=900', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=800', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=700', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=600', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=500', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=400', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=300', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=200', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=100', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/44138241/?start=0', tag: '单词记忆法' },
  // { url: 'http://www.douban.com/group/topic/51189613/?start=300', tag: '钢琴入门' },
  // { url: 'http://www.douban.com/group/topic/51189613/?start=200', tag: '钢琴入门' },
  // { url: 'http://www.douban.com/group/topic/51189613/?start=100', tag: '钢琴入门' },
  // { url: 'http://www.douban.com/group/topic/51189613/?start=0', tag: '钢琴入门' },
  // { url: 'http://www.douban.com/group/topic/23934101/?start=800', tag: '经典之作' },
  // { url: 'http://www.douban.com/group/topic/23934101/?start=700', tag: '经典之作' },
  // { url: 'http://www.douban.com/group/topic/23934101/?start=600', tag: '经典之作' },
  // { url: 'http://www.douban.com/group/topic/23934101/?start=500', tag: '经典之作' },
  // { url: 'http://www.douban.com/group/topic/23934101/?start=400', tag: '经典之作' },
  // { url: 'http://www.douban.com/group/topic/23934101/?start=300', tag: '经典之作' },
  // { url: 'http://www.douban.com/group/topic/23934101/?start=200', tag: '经典之作' },
  // { url: 'http://www.douban.com/group/topic/23934101/?start=100', tag: '经典之作' },
  // { url: 'http://www.douban.com/group/topic/23934101/?start=0', tag: '经典之作' },
  // { url: 'http://www.douban.com/online/10885554/discussion/37571841/?start=700', tag: '留下邮箱' },
  // { url: 'http://www.douban.com/online/10885554/discussion/37571841/?start=600', tag: '留下邮箱' },
  // { url: 'http://www.douban.com/online/10885554/discussion/37571841/?start=500', tag: '留下邮箱' },
  // { url: 'http://www.douban.com/online/10885554/discussion/37571841/?start=400', tag: '留下邮箱' },
  // { url: 'http://www.douban.com/online/10885554/discussion/37571841/?start=300', tag: '留下邮箱' },
  // { url: 'http://www.douban.com/online/10885554/discussion/37571841/?start=200', tag: '留下邮箱' },
  // { url: 'http://www.douban.com/online/10885554/discussion/37571841/?start=100', tag: '留下邮箱' },
  // { url: 'http://www.douban.com/online/10885554/discussion/37571841/?start=0', tag: '留下邮箱' },
  // { url: 'http://www.douban.com/group/topic/51392996/?start=200', tag: '新东方学英语' },
  // { url: 'http://www.douban.com/group/topic/51392996/?start=100', tag: '新东方学英语' },
  // { url: 'http://www.douban.com/group/topic/51392996/?start=0', tag: '新东方学英语' },
  // { url: 'http://www.douban.com/group/topic/51148914/?start=100', tag: 'AI广告海报' },
  // { url: 'http://www.douban.com/group/topic/51148914/?start=0', tag: 'AI广告海报' },
  // { url: 'http://www.douban.com/group/topic/48122395/?start=100', tag: 'MBA' },
  // { url: 'http://www.douban.com/group/topic/48122395/?start=0', tag: 'MBA' },
  // { url: 'http://www.douban.com/group/topic/47248261/?start=300', tag: '小狮子背包' },
  // { url: 'http://www.douban.com/group/topic/47248261/?start=200', tag: '小狮子背包' },
  // { url: 'http://www.douban.com/group/topic/47248261/?start=100', tag: '小狮子背包' },
  // { url: 'http://www.douban.com/group/topic/47248261/?start=0', tag: '小狮子背包' },
  // { url: 'http://www.douban.com/group/topic/46572604/', tag: '手工毛线编织' },
  // { url: 'http://www.douban.com/group/topic/47234708/', tag: '海报设计' },
  // { url: 'http://www.douban.com/group/topic/26879644/?start=400', tag: 'BV' },
  // { url: 'http://www.douban.com/group/topic/26879644/?start=300', tag: 'BV' },
  // { url: 'http://www.douban.com/group/topic/26879644/?start=200', tag: 'BV' },
  // { url: 'http://www.douban.com/group/topic/26879644/?start=100', tag: 'BV' },
  // { url: 'http://www.douban.com/group/topic/26879644/?start=0', tag: 'BV' },
  // { url: 'http://www.douban.com/group/topic/46516179/?start=200', tag: 'AI 教程' },
  // { url: 'http://www.douban.com/group/topic/46516179/?start=100', tag: 'AI 教程' },
  // { url: 'http://www.douban.com/group/topic/46516179/?start=0', tag: 'AI 教程' },
  // { url: 'http://www.douban.com/group/topic/49416200/', tag: 'PT发烧友邀请码' },
  // { url: 'http://www.douban.com/group/topic/47261522/?start=600', tag: '雅思培训' },
  // { url: 'http://www.douban.com/group/topic/47261522/?start=500', tag: '雅思培训' },
  // { url: 'http://www.douban.com/group/topic/47261522/?start=400', tag: '雅思培训' },
  // { url: 'http://www.douban.com/group/topic/47261522/?start=300', tag: '雅思培训' },
  // { url: 'http://www.douban.com/group/topic/47261522/?start=200', tag: '雅思培训' },
  // { url: 'http://www.douban.com/group/topic/47261522/?start=100', tag: '雅思培训' },
  // { url: 'http://www.douban.com/group/topic/47261522/?start=0', tag: '雅思培训' },
  // { url: 'http://www.douban.com/group/topic/48165557/?start=200', tag: '练口语' },
  // { url: 'http://www.douban.com/group/topic/48165557/?start=100', tag: '练口语' },
  // { url: 'http://www.douban.com/group/topic/48165557/?start=0', tag: '练口语' },
  { url: 'http://tieba.baidu.com/p/2290049625?pn=0', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=1', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=2', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=3', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=4', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=5', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=6', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=7', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=8', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=9', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=10', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=11', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=12', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=13', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=14', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=15', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=16', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=17', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=18', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=19', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=20', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=21', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=22', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=23', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=24', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=25', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=26', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=27', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=28', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=29', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=30', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=31', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=32', tag: '紫丝吧' },
{ url: 'http://tieba.baidu.com/p/2290049625?pn=33', tag: '紫丝吧' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
  // { url: '', tag: '' },
];
loop();

function loop(){
  var do_loop = function(){
    if(list.length===0){
      console.log('all is done');
      return;
    }
    var col = list.shift();
    url = col.url;
    tag = col.tag;
    get_at_from_url(url, function(html){
      var ats = regx_get_at(html);
      if(ats && ats.length){
        set_json(ats, function(){
          do_loop();
        });
      }else{
        do_loop();
      }
    });
  };
  do_loop();
}
