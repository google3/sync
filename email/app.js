var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: 'zf20011213@163.com',
        pass: 'wx159753'
    }
});
var fs=require('fs');
var html_str = fs.readFileSync(__dirname + '/./email.html', 'utf-8');

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '恶魔巫师<zf20011213@163.com>', // sender address
    to: '522195330@qq.com',
    // to: 'nodejs.js@gmail.com',
    // to: 'linmin88@qq.com',
    subject: '组图：日本陆上自卫队举行大规模武力展示', // Subject line
    // text: 'Hello world', // plaintext body
    html: html_str,
    // attachments:[
      // {
        // filename: '1.pdf',
        // path: 'F:\\1.pdf'
      // },
    // ]
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});
