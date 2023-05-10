const express = require('express');
const app = express();

require('dotenv').config();
const API_KEY = process.env.OPENAI_API_KEY;

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

app.get('/main', (req, res) => {
    res.render('./main.ejs');
});

async function getMessage(message) {
    console.log('clicked');
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ 
                role: "user", 
                content: `Can you give me a step by step guide on ${message} the form of(include the curly brackets):
                Title: {How to ...}
                Description: {A step by step guide on how to ...}
                1. {...}
                2. {...}
                3. {...}
                ...
                ` 
            }],
            max_tokens: 500,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

app.post('/sendRequest', async (req, res) => {
    var userInput = req.body.textInput;

    let returnMessage = await getMessage(userInput);
    console.log(returnMessage.choices[0].message);

});

module.exports = app;