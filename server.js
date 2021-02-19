
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const fs = require("fs");
const http = require("http");
const https = require("https");
// const userRouter = require('./routes/user.js');
const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = 4433;
const ASSETS = "./assets/";
const SSL_KEY_FILE = ASSETS + "server.key";
const SSL_CRT_FILE = ASSETS + "server.crt";

const https_options = {
    key: fs.readFileSync(__dirname + "/" + SSL_KEY_FILE),
    cert: fs.readFileSync(__dirname + "/" + SSL_CRT_FILE)
};

// Main Lyt
app.engine('.hbs', exphbs({ extname: '.hbs',
defaultLayout: 'main',
layoutsDir: path.join(__dirname, 'views/layouts')
 }));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('static'));

// Express Routes
// #1 Page - Not Found
app.get('/', (req,res) => {
    res.render('index',{title: 'Arafat Az'});
});
// #2 Page - Contact Form
app.get('/Contact', (req,res) => {
    res.render('contact',{title: 'Contact Me'});
});


// #4 Page - Not Found
app.get("*", (req,res) => {
    res.render('error',{title: 'PAGE NOT FOUND'});
})
http.createServer(app).listen(HTTP_PORT, onHttpStart);
https.createServer(https_options, app).listen(HTTPS_PORT, onHttpsStart);

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
function onHttpsStart() {
    console.log("Express https server listening on: " + HTTPS_PORT);
}
