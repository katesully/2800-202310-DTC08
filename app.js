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

app.get('/savedRoadmaps', (req, res) => {
    const roadmapsTemp = [
        {title: "Temp Roadmap 1", description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum velit vero vel officia totam aperiam debitis asperiores accusantium suscipit ab? Quasi laborum eius culpa a perferendis, deserunt nostrum eveniet nulla!", body:{}}, {title: "Temp Roadmap 2", description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum velit vero vel officia totam aperiam debitis asperiores accusantium suscipit ab? Quasi laborum eius culpa a perferendis, deserunt nostrum eveniet nulla!", body:{}},{title: "Temp Roadmap 3", description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum velit vero vel officia totam aperiam debitis asperiores accusantium suscipit ab? Quasi laborum eius culpa a perferendis, deserunt nostrum eveniet nulla!", body:{}},
        {title: "Temp Roadmap 4", description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum velit vero vel officia totam aperiam debitis asperiores accusantium suscipit ab? Quasi laborum eius culpa a perferendis, deserunt nostrum eveniet nulla!", body:{}},
        {title: "Temp Roadmap 5", description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum velit vero vel officia totam aperiam debitis asperiores accusantium suscipit ab? Quasi laborum eius culpa a perferendis, deserunt nostrum eveniet nulla!", body:{}},
        {title: "Temp Roadmap 6", description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum velit vero vel officia totam aperiam debitis asperiores accusantium suscipit ab? Quasi laborum eius culpa a perferendis, deserunt nostrum eveniet nulla!", body:{}},
        {title: "Temp Roadmap 7", description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum velit vero vel officia totam aperiam debitis asperiores accusantium suscipit ab? Quasi laborum eius culpa a perferendis, deserunt nostrum eveniet nulla!", body:{}}
    ];

    res.render('./savedRoadmaps.ejs', {savedList: roadmapsTemp});
});

module.exports = app;