// const express = require('express');
// const ejs = require('ejs');
// require('dotenv').config();
import express from 'express';
import ejs from 'ejs';
import dotenv  from "dotenv"
dotenv.config();
export const app = express();
import { user } from './login.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', __dirname + '/views');
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');
app.set('view engine', ejs);

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

app.post('/login', (req, res) => {
    if (user) {
        res.redirect('/main');
    } else {
        res.redirect('/login');
    }
}
);

app.get('/main', (req, res) => {
    res.render('./main.ejs');
});

// module.exports = app; 