
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const clientSessions = require("client-sessions");
const fs = require("fs");
const http = require("http");
const https = require("https");
const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = 4433;
const ASSETS = "./assets/";
const SSL_KEY_FILE = ASSETS + "server.key";
const SSL_CRT_FILE = ASSETS + "server.crt";
require('dotenv').config();
// require('./controllers/connection');
const nodemailer = require("nodemailer");
const multer = require('multer');
const uuid = require('uuid').v4;
const Image = require ('./models/image');

// require ('./controllers/UserController.js');
const filestorage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null, './upload');
    }, filename:   (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const id = uuid();
            const filePath = `images/${id}${ext}`;
            Image.create({ filePath }) 
                .then(() => {
                    cb(null,filePath);
                });
    }
});
const upload = multer({storage: filestorage}).array('image');
// get an environment variable
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
// const captcha = require('./routes/captcha.js');
const https_options = {
    key: fs.readFileSync(__dirname + "/" + SSL_KEY_FILE),
    cert: fs.readFileSync(__dirname + "/" + SSL_CRT_FILE)
};

app.engine('.hbs', exphbs({ extname: '.hbs',
defaultLayout: 'main',
layoutsDir: path.join(__dirname, 'views/layouts'),
partialsDir: __dirname + '/views/partials'
 }));
app.set('view engine', '.hbs');

// app.use('/', captcha);
app.use(express.static('static'));
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "smonajemi", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));
  

//routing
app.get('/',(req,res) => {
    res.render('index',{title: 'PAINT2GO'});
});
app.get('/colors',(req,res) => {
    res.render('colors',{title: 'Colors'});
});

app.post('/', (req, res) => {
    let arr = [];
    let obj = {};
    upload(req, res, function(e){
        if(e){
           console.log("error");
           res.render('index',{title: 'PAINT2GO'});
        } else {
            console.log(req.files);
            // for(var i=0; i<req.files.length; i++){
            //   obj["filepath"] = req.files[i].path;
            //   arr.push(obj);
            // }
        const files = req.files;
        const attachments = files.map((file)=>{
        return { filename: file.originalname, path: file.path };
        });
  
    console.log(attachments);
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const email = req.body.email;
    const phone = req.body.phone;
    const message = req.body.message;
    var admin = `info@paint2go.ca`;

    //const recaptcha = req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null;
    const data = fname && lname && email && phone && message;  
    if(data === "") {
        return res.render("partials/contact.hbs", { errorMsg: "Error in one or more fields", title: 'Contact Me'});        
    }
    // if(recaptcha) {
    //     return res.render("partials/contact.hbs", { errorMsg: "You can't leave Captcha Code empty", title: 'Contact Me'});        
    // }
    // var secretKey = "6Lcj6XQaAAAAALoUExIxDrCPb0lK781UeoUnCmdZ";
    // var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  
//     request(verificationUrl,function(error,response,body) {
//         body = JSON.parse(body);
//         if(body.success !== undefined && !body.success) {
//             return false;
//         }
//     return true;
//   });  
setTimeout(() => {


var date = new Date();
const fullname = (req.body.first_name + " " + req.body.last_name).toUpperCase();
    const transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",  
        secure: true,
        secureConnection: true, // TLS requires secureConnection to be false
        requireTLS:true,
        port: 465,
        debug: true,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,         
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
          }
});    
    const emailAdmin = {
        from: email,
        to: admin,
        subject: `${fullname}`,
        html: `<div style="text-align: center;text-transform:uppercase"><h3>NEW MESSAGE FROM <a style="color:red;">${fullname}</a></h3></div> <br>
                <b><p><a style="color:red;"> "</a> ${req.body.message} <a style="color:red;"> "</a></b><br><hr><br><i>${fullname} <br> ${req.body.phone}<br>
                ${req.body.email}</i></p> <br><br> ${date}`,
        attachments:attachments
    }    

    const emailSender = {
        from: admin,
        to: email,
        subject: `Thank You`,
        html: `<div style="text-align: center;text-transform:uppercase">
        <h4 style="color:#a08631;">Your message has been received</h4>
        </div> 
        <h5>Hi ${req.body.first_name},</h5>
	    <h5>Thank you for reaching out! <br> I will get back to you soon.</h5>
        <h5>Best, <br> Ali <br> www.paint2go.ca</h5>
        <hr>
        <div style="text-align:left;"><h5 style="text-transform:uppercase">Your message: <br> <div style="color:#709fb0; margin-left: 25px;">${req.body.message}</div></h5><br>
        <h5>Sent from: <br> ${fullname} <br> ${req.body.email}</h5>
        </div> `,
        attachments:attachments
    } 

    // verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
        const mailOption = [emailAdmin, emailSender];
        var i = 1;
        mailOption.forEach(e => {             
            transporter.sendMail(e, (err) => {
                var flag = Boolean(false);
                while(!flag){   
                    if(err){
                        console.log(`EMAIL COULD NOT BE SENT - ${err}`);
                        flag = false;
                        break;
                    }else{
                        console.log( `Email ${i} sent successully.`);
                        flag = true;
                    }
                }
                if(i == 2){
                    if(flag == false){                    
                        res.send(`<h2>Oops... Error Sending Email!</h2><br><h5>${err}</h5><hr><br> <h3>It seems very having a problem with our mailing system. Please click <a href="mailto:info@paint2go.ca">HERE</a> to email us directly!<br><br>Thank you for your patience.</h3>
                                    
                        `);
                    }else{
                        res.redirect('/thankyouPage');   
                        exit = true;
                    }
                }
            i++;
            });    
        }); 
    }
  });
    
}, 2 * 1000);
}
});
});

// Admin
app.get('/admin',(req,res) => {
    res.render('admin',{title: 'Admin'});
});

// Final Page
app.get("/thankyouPage",  (req,res) => {
    if(exit == true){
        res.render('thankyouPage',{title: 'THANK YOU!'});
    } else {
        res.redirect('/');
    }
    exit = false;
})

// Download Button
app.get('/downloadResume', (req, res) => {
    res.download(__dirname + '/static/sinamonajemi.pdf', 'sinamonajemi.pdf')
  })

app.get("*", (req,res) => {
    res.render('errorPage',{title: 'PAGE NOT FOUND'});
})

app.get("/contact", (req,res) => {
    res.render('contact',{title: 'Contact'});
});

http.createServer(app).listen(HTTP_PORT, onHttpStart);
https.createServer(https_options, app).listen(HTTPS_PORT, onHttpsStart);

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
function onHttpsStart() {
    console.log("Express https server listening on: " + HTTPS_PORT);
}
