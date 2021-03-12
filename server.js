
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const clientSessions = require("client-sessions");
const fs = require("fs");
const http = require("http");
const https = require("https");
const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = 4433;
const ASSETS = "./assets/";
const SSL_KEY_FILE = ASSETS + "server.key";
const SSL_CRT_FILE = ASSETS + "server.crt";
const nodemailer = require("nodemailer");
const request = require('request');
require ('./controllers/connection.js');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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
    res.render('index',{title: 'Sina Monajemi'});
});


app.post('/', (req, res) => {
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const email = req.body.email;
    const phone = req.body.phone;
    const message = req.body.message;
    const recaptcha = req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null;
    const data = fname && lname && email && phone && message;  
    if(data === "") {
        return res.render("partials/contact.hbs", { errorMsg: "Error in one or more fields", title: 'Contact Me'});        
    }
    if(recaptcha) {
        return res.render("partials/contact.hbs", { errorMsg: "You can't leave Captcha Code empty", title: 'Contact Me'});        
    }
    var secretKey = "6Lcj6XQaAAAAALoUExIxDrCPb0lK781UeoUnCmdZ";
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  
    request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
            return false;
        }
    return true;
  });  
setTimeout(() => {

var admin = `contactsinamon@gmail.com`;
var date = new Date();
const fullname = (req.body.first_name + " " + req.body.last_name).toUpperCase();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'contactsinamon@gmail.com',
            pass: 'qrqiuzxtzkrllmeb'
        },
        tls:{
            rejectUnauthorized: false
        }
});    
    const emailAdmin = {
        from: req.body.email,
        to: admin,
        subject: `${fullname}`,
        html: `<div style="text-align: center;text-transform:uppercase"><h3>NEW MESSAGE FROM <a style="color:red;">${fullname}</a></h3></div> <br>
                <b><p><a style="color:red;"> "</a> ${req.body.message} <a style="color:red;"> "</a></b><br><hr><br><i>${fullname} <br> ${req.body.phone}<br>
                ${req.body.email}</i></p> <br><br> ${date}`
    }    

    const emailSender = {
        from: req.body.email,
        to: req.body.email,
        subject: `Thank You`,
        html: `<div style="text-align: center;text-transform:uppercase">
        <h4 style="color:#a08631;">Your message has been received</h4>
        </div> 
        <h5>Hi ${req.body.first_name},</h5>
	    <h5>Thank you for reaching out! <br> I will get back to you soon.</h5>
        <h5>Best, <br> SINA MONAJEMI <br> <a href="https://smonajemi.com">smonajemi.com</a></h5>
        <hr>
        <div style="text-align:left;"><h5 style="text-transform:uppercase">Your message: <br> <div style="color:#709fb0; margin-left: 25px;">${req.body.message}</div></h5><br>
        <h5>Sent from: <br> ${fullname} <br> ${req.body.email}</h5>
        </div> `
    } 

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
                    res.send(`<h3>Oops... Error Sending Email!</h3><hr><br> <h5>${err}</h5>`);
                }else{
                    res.redirect('/thankyouPage');   
                    exit = true;
                }
            }
        i++;
        });    
    });  
}, 2 * 1000);
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

http.createServer(app).listen(HTTP_PORT, onHttpStart);
https.createServer(https_options, app).listen(HTTPS_PORT, onHttpsStart);

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
function onHttpsStart() {
    console.log("Express https server listening on: " + HTTPS_PORT);
}
