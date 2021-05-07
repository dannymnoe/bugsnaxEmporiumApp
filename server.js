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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: "my-key-is-BASED", resave: true, saveUninitialized: false }));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

// Look for static files
app.use(express.static('views/'));
app.use(express.static('assets/'));
app.use(express.static('assets/css/'));
app.use(express.static('assets/img/'));
app.use(express.static('assets/js/'));
app.use(express.static('assets/vendor/'));


const path = require('path');

app.engine('handlebars', expbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Define our port #
const PORT = process.env.PORT || 5000;

const connection = mysql.createConnection({
    host: '192.185.2.183',
    database: 'ntansino_snakbook_login',
    user: 'ntansino_admin1',
    password: 'basedPassword69',
    port: '3306'
});

connection.connect(function (err) {
    if (err) {
        console.log("Connection Error: " + err);
    }
    else {
        console.log("Connection Successful");
    }
});

//var Bugsnak_collection_json = require("./Bugsnak_collections");

const new_bag = {
    "slot0": {
        "img_link": "bugsnax/empty_slot.png",
        "snakname": "Not Populated",
        "slotAvailable": true
    },
    "slot1": {
        "img_link": "bugsnax/empty_slot.png",
        "snakname": "Not Populated",
        "slotAvailable": true
    },
    "slot2": {
        "img_link": "bugsnax/empty_slot.png",
        "snakname": "Not Populated",
        "slotAvailable": true
    },
    "slot3": {
        "img_link": "bugsnax/empty_slot.png",
        "snakname": "Not Populated",
        "slotAvailable": true
    },
    "slot4": {
        "img_link": "bugsnax/empty_slot.png",
        "snakname": "Not Populated",
        "slotAvailable": true
    },
    "slot5": {
        "img_link": "bugsnax/empty_slot.png",
        "snakname": "Not Populated",
        "slotAvailable": true
    }
};

app.get('/', function (req, res) {
    res.render('index', { title: 'Home' });
});

app.get('/index', function (req, res) {
    res.redirect('/');
});

app.get('/snakbook', function (req, res) {
    res.render('snakbook', { title: 'Snakbook' });
});

app.get('/collection', function (req, res) {
    //res.render('collection', {title: 'Collection'});

    //console.log(req.session.id);
    var sql = "SELECT * FROM user_auth WHERE sessionID='" + req.session.id + "'";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            res.redirect('/login');
        }
        else {

            // console.log(Bugsnak_collection_json);
            // console.log(Bugsnak_collection_json[result[0].username]);

            var Bugsnak_collection_json = require("./Bugsnak_collections");

            var user_collection = Bugsnak_collection_json[result[0].username];

            res.render('collection', {
                title: 'Collection',
                real_name: result[0].name,
                username: result[0].username,
                password: result[0].password,
                snak_name0: user_collection["slot0"].snakname,
                img_link0: user_collection["slot0"].img_link,
                snak_name1: user_collection["slot1"].snakname,
                img_link1: user_collection["slot1"].img_link,
                snak_name2: user_collection["slot2"].snakname,
                img_link2: user_collection["slot2"].img_link,
                snak_name3: user_collection["slot3"].snakname,
                img_link3: user_collection["slot3"].img_link,
                snak_name4: user_collection["slot4"].snakname,
                img_link4: user_collection["slot4"].img_link,
                snak_name5: user_collection["slot5"].snakname,
                img_link5: user_collection["slot5"].img_link
            });
        }
    });

});

app.get('/login', function (req, res) {

    var sql = "SELECT * FROM user_auth WHERE sessionID='" + req.session.id + "'";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            res.render('login', { title: 'Sign In / Log In' });
        }
        else {
            res.redirect('/collection');
        }
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        // console.log("User logged out");
    });
    res.redirect('/');
});

app.get('/bagfull', function (req, res) {
    res.render('bagfull', {title: 'Bag is Full!'});
});

app.post('/tryRegister', function (req, res) {
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

    connection.query(sql_username_query, function (err, result) {
        if (result.length == 0) {
            // The username does not already exist so create new account
            var Bugsnak_collection_json = require("./Bugsnak_collections");
            Bugsnak_collection_json[reg_json.username_register] = new_bag;
            const fs = require("fs");
            let collect_str = JSON.stringify(Bugsnak_collection_json);
            fs.writeFileSync('./Bugsnak_collections.json', collect_str);

            connection.query(sql, function (err, result) {
                if (err) throw err;
                res.redirect('collection');
            });
        }
        else {
            // Username is taken
            res.render('redirect', { title: 'Username Taken', msg: 'The username you entered is registered already' });
            console.log("Username taken");
        }
    });

});

app.post('/tryLogIn', function (req, res) {

    // Init the session so the ID is fixed
    req.session.arb_data = 'data';

    const reg_json = req.body;
    console.log(reg_json);

    var sql = "SELECT * FROM user_auth WHERE username='" + reg_json.username_login + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
            console.log("Username not found");
            res.render('redirect', { title: 'Username Not Registered', msg: 'The username you entered is has not yet been registered.' });
        }

        else if (reg_json.password_login != result[0].password) {
            console.log("Password not found");
            res.render('redirect', { title: 'Incorrect Password', msg: 'The password you entered is not correct.' });
        }
        else {
            sql_update = "UPDATE user_auth SET sessionID = '" + req.session.id + "' WHERE username = '" + reg_json.username_login + "'";
            connection.query(sql_update, function (err, result) {
                if (err) throw err;
                else {
                    console.log("SessionID should have been updated");
                    console.log("SID in app post /profile : " + req.session.id + " username: " + reg_json.username_login);
                }
            });
            res.redirect('/collection');

        }
    });

});

function find_empty_slot(user_collection) {
    // Given a user_collection JSON object
    // Return the empty slot as a str, if available
    // Returns "full" if the user's bag is full
    var empty_slot = "full";
    console.log("You are in find_empty_slot");
    var found_slot = false;
    Object.entries(user_collection).forEach(entry => {
        let slot_str = entry[0];
        let slot_json = entry[1];
        if (slot_json.slotAvailable && !found_slot) {
            empty_slot = slot_str;
            found_slot = true;
            console.log("Found empty slot" + slot_json);
        }
    });
    console.log(empty_slot);
    return empty_slot;
}

var new_slot = {}

app.post('/addSnak', function (req, res) {
    //new_slot = req.body;
    new_slot = {
        "img_link": req.body.img_path,
        "snakname": req.body.snak_id,
        "slotAvailable": false
    };
    console.log(new_slot);

    var sql = "SELECT * FROM user_auth WHERE sessionID='" + req.session.id + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {

            return res.redirect('/login');
        }
        else {
            var Bugsnak_collection_json = require("./Bugsnak_collections");
            var user_collection = Bugsnak_collection_json[result[0].username];
            var empty_slot = find_empty_slot(user_collection);
            if (empty_slot == "full") {
                console.log("Inventory is full");
                res.redirect('/bagfull');
            }
            else {
                console.log("Space available");
                console.log(user_collection[empty_slot]);
                user_collection[empty_slot] = new_slot;
                console.log(user_collection[empty_slot]);

                const fs = require("fs");
                let collect_str = JSON.stringify(Bugsnak_collection_json);
                fs.writeFileSync('./Bugsnak_collections.json', collect_str);
                res.redirect('/collection');
            }

        }
    });

});

app.post('/empty_bag', function (req, res) {

    var sql = "SELECT * FROM user_auth WHERE sessionID='" + req.session.id + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            return res.redirect('/login');
        }
        else {
            var Bugsnak_collection_json = require("./Bugsnak_collections");
            console.log(Bugsnak_collection_json[result[0].username])
            Bugsnak_collection_json[result[0].username] = new_bag;
            console.log(Bugsnak_collection_json[result[0].username])
            const fs = require("fs");
            let collect_str = JSON.stringify(Bugsnak_collection_json);
            fs.writeFileSync('./Bugsnak_collections.json', collect_str);
            res.redirect('/collection');
        }
    });
});

app.listen(PORT, function () {
    console.log(`Final Project app listening at http://localhost:${PORT}`)
});