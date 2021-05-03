// Import express
const express = require('express');
const bodyParser = require('body-parser');
const expbs = require('express-handlebars');

// MySQL
const mysql = require('my-sql');

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
    // Init the session so the ID is fixed
    res.redirect('/');
});

app.get('/snakbook', function(req, res){
    res.render('snakbook', {title: 'Snakbook'});
});

app.get('/collection', function(req, res){
    //res.render('collection', {title: 'Collection'});

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

    console.log(req.session.id);
    var sql = "SELECT * FROM user_auth WHERE sessionID='" + req.session.id + "'";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 0){
            res.redirect('/login');
        }
        else {
            res.render('collection', {title: 'Registered', 
                real_name : result[0].name, 
                username : result[0].username,
                password: result[0].password});
            
        }
    });

    connection.end(function(err) {
        if(err) {
            console.log("Disconnect error: " + err);
        }
        else {
            console.log("Connection End Successful");
        }
    });

});

app.get('/login', function(req, res){
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

    var sql = "SELECT * FROM user_auth WHERE sessionID='" + req.session.id + "'";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 0){
            res.render('login', {title: 'Sign In / Log In'});
        }
        else {
            res.render('collection', {title: 'Registered', 
                real_name : result[0].name, 
                username : result[0].username,
                password: result[0].password});
            
        }
    });

    connection.end(function(err) {
        if(err) {
            console.log("Disconnect error: " + err);
        }
        else {
            console.log("Connection End Successful");
        }
    });
    
});

app.get('/logout', function(req, res){
    req.session.destroy(function(){
        // console.log("User logged out");
    });
    res.redirect('/');
});

app.post('/tryRegister', function(req, res) {
    const reg_json = req.body;
    console.log(reg_json);


    // Init the session so the ID is fixed
    req.session.arb_data = 'data';

    var sql = "INSERT INTO user_auth (sessionID, name, username, password) VALUES (";
    sql += "'" + req.session.id + "',";                 // SessionID
    sql += "'" + reg_json.real_name_register + "',";    // Real Name
    sql += "'" + reg_json.username_register + "',";     // User Name
    sql += "'" + reg_json.password_register + "');";    // Password
    console.log(sql);
    sql_username_query = "SELECT * FROM user_auth WHERE username='" + reg_json.username_register + "'";
    

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
    
    
    connection.query(sql_username_query, function(err, result) {
        if (result.length == 0) {
            // The username does not already exist so create new account
            connection.query(sql, function(err, result) {
                if (err) throw err;
                res.redirect('collection');
            });
        }
        else {
            // Username is taken
            res.render('redirect', {title: 'Username Taken', msg: 'The username you entered is registered already'});
            console.log("Username taken");
        }
    });

    // connection.end(function(err) {
    //     if(err) {
    //         console.log("Disconnect error: " + err);
    //     }
    //     else {
    //         console.log("Connection End Successful");
    //     }
    // });

});

app.post('/tryLogIn', function(req, res) {

    // Init the session so the ID is fixed
    req.session.arb_data = 'data';
    
    const reg_json = req.body;
    console.log(reg_json);
    
    var sql = "SELECT * FROM user_auth WHERE username='" + reg_json.username_login + "'";

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

    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0){
            console.log("Username not found");
            res.render('redirect', {title: 'Username Not Registered', msg: 'The username you entered is has not yet been registered.'});
        }
        //console.log(result[0].actual_name + " " + result[0].username + " " + result[0].password);
        else if (reg_json.password_login != result[0].password){
            console.log("Password not found");
            res.render('redirect', {title: 'Incorrect Password', msg: 'The password you entered is not correct.'});
        }
        else {
            sql_update = "UPDATE user_auth SET sessionID = '" + req.session.id + "' WHERE username = '" + reg_json.username_login + "'";
            connection.query(sql_update, function(err, result){
                if (err) throw err;
                else {
                    console.log("SessionID should have been updated");
                    console.log("SID in app post /profile : " + req.session.id + " username: " + reg_json.username_login);
                }
            });
            //res.render('profile', {title: 'Profile - Lab 10', name: result[0].actual_name, username: result[0].username, password: result[0].password});
            res.render('collection', {title: 'Registered', 
                real_name : result[0].name, 
                username : result[0].username,
                password: result[0].password});
            // ^ Will probably become a direct
        }
    });

    // connection.end(function(err) {
    //     if(err) {
    //         console.log("Disconnect error: " + err);
    //     }
    //     else {
    //         console.log("Connection End Successful");
    //     }
    // });

});


app.listen(PORT, function() {
    console.log(`Final Project app listening at http://localhost:${PORT}`)
});