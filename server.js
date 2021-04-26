// Import express
const express = require('express');
const bodyParser = require('body-parser');
const expbs = require('express-handlebars');

// const jquery = require('jquery');
// const bootstrap = require('bootstrap');


// Session and Cookies
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Create express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret:"my-key-is-BASED", resave: true, saveUninitialized: false}));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static('views/img/'));
app.use(express.static('views'));

const path = require('path');

app.engine('handlebars', expbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Define our port #
const PORT = process.env.PORT || 5000;

// Look for static files
app.use(express.static('views'));

app.get('/', function(req, res){
    res.render('index', {title: 'Home'});
});

app.get('/index', function(req, res){
    res.render('index', {title: 'Home'});
});

app.get('/snakbook', function(req, res){
    res.render('snakbook', {title: 'Home'});
});

app.get('/collection', function(req, res){
    res.render('collection', {title: 'Home'});
});

app.get('/login', function(req, res){
    res.render('login', {title: 'Home'});
});

app.listen(PORT, function() {
    console.log(`Final Project app listening at http://localhost:${PORT}`)
});