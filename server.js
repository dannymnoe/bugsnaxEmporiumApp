// Import express
const express = require('express');
const bodyParser = require('body-parser');
const expbs = require('express-handlebars');

// MySQL
const mysql = require('my-sql');

const connection = mysql.createConnection({
    host: '192.185.2.183',
    database: 'ntansino_snakbook_login',
    user: 'ntansino_admin1',
    password: 'basedPassword69',
    port: '3306'
});

connection.connect(function(err) {
    if(err) {
        console.log("Connection Error: " + err);
    }
    else {
        console.log("Connection Successful");
    }
});

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

// Look for static files
app.use(express.static('views/'));
app.use(express.static('assets/'));
app.use(express.static('assets/css/'));
app.use(express.static('assets/img/'));
app.use(express.static('assets/js/'));
app.use(express.static('assets/vendor/'));


const path = require('path');

app.engine('handlebars', expbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Define our port #
const PORT = process.env.PORT || 5000;

app.get('/', function(req, res){
    res.render('index', {title: 'Home'});
});

app.get('/index', function(req, res){
    res.render('index', {title: 'Home'});
});

app.get('/snakbook', function(req, res){
    res.render('snakbook', {title: 'Snakbook'});
});

app.get('/collection', function(req, res){
    res.render('collection', {title: 'Collection'});
});

app.get('/login', function(req, res){
    res.render('login', {title: 'Sign In / Log In'});
});

app.post('/tryRegister', function(req, res) {
    const reg_json = req.body;
    console.log(reg_json);

    // var sql = "INSERT INTO user_auth ('sessionID', 'name', 'username', 'password') VALUES (";
    // sql += " '" + "number12345" + "',";               // SessionID
    // sql += " '" + reg_json.real_name_register + "',"; // Name
    // sql += " '" + reg_json.email_register + "',";     // email
    // sql += " '" + reg_json.password_register + "')";  // Password


    var sql = "INSERT INTO user_auth (sessionID, name, username, password) VALUES (";
    sql += "'sessionID123',"
    sql += "'" + reg_json.real_name_register + "',";
    sql += "'" + reg_json.username_register + "',";
    sql += "'" + reg_json.password_register + "');";
    console.log(sql);
    sql_username_query = "SELECT * FROM user_auth WHERE username='" + reg_json.email_register + "'";
    connection.query(sql_username_query, function(err, result) {
        if (result.length == 0) {
            // The username does not already exist so create new account
            connection.query(sql, function(err, result) {
                if (err) throw err;
                res.render('registered.handlebars', {title: 'Registered', 
                username : reg_json.real_name_register, 
                email : reg_json.email_register,
                password: reg_json.password_register});
            });
        }
        else {
            // Username is taken
            //res.render('redirect', {title: 'Username Taken - Lab 10', msg: 'The username you entered is registered already'});
            console.log("Username taken");
        }
    });

    // res.render('registered.handlebars', {title: 'Registered', 
    // username : reg_json.real_name_register, 
    // email : reg_json.email_register,
    // password: reg_json.password_register});
});

app.post('/tryLogIn', function(req, res) {
    
    const reg_json = req.body;
    console.log(reg_json);
    
    var sql = "SELECT * FROM user_auth WHERE username='" + reg_json.username_login + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0){
            console.log("Username not found");
            // console.log("No results found");
            //res.render('redirect', {title: 'Username Not Registered - Lab 10', msg: 'The username you entered is has not yet been registered.'});
        }
        //console.log(result[0].actual_name + " " + result[0].username + " " + result[0].password);
        else if (reg_json.password_login != result[0].password){
            console.log("Password not found");
            //res.render('redirect', {title: 'Incorrect Password - Lab 10', msg: 'The password you entered is not correct.'});
        }
        else {
            //sql_update = "UPDATE lab10_table SET session_id = '" + req.session.id + "' WHERE username = '" + reg_json.login_username + "'";
            // connection.query(sql_update, function(err, result){
            //     if (err) throw err;
            //     else {
            //         // console.log("SID in app post /profile : " + req.session.id + " username: " + reg_json.login_username);
            //     }
            // });
            //res.render('profile', {title: 'Profile - Lab 10', name: result[0].actual_name, username: result[0].username, password: result[0].password});
            res.render('registered', {title: 'Registered', 
                username : result[0].name, 
                email : result[0].username,
                password: result[0].password});
        }
    });
});


app.listen(PORT, function() {
    console.log(`Final Project app listening at http://localhost:${PORT}`)
});