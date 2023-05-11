const express = require('express');
const app = express();
require('dotenv').config();
const ejs = require('ejs');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"));
app.use(express.json())

app.get(['/', '/home'], (req, res) => {
    // if (req.session.GLOBAL_AUTHENTICATED) {
    res.render('./index.ejs');
    // }
});

app.get('/signup', (req, res) => {
    res.render('./signup.ejs');
});

app.get('/login', (req, res) => {
    res.render('./login.ejs');
});

app.get('/settings', (req, res) => {
    res.render('./settings.ejs');
});

app.get('/main', (req, res) => {
    res.render('./main.ejs');
});

module.exports = app;