const express = require('express');
const app = express();

require('dotenv').config();
const API_KEY = process.env.OPENAI_API_KEY;

const ejs = require('ejs');
const { parse } = require('dotenv');
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

// Interface with OpenAI API
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
                content: `Give me a step by step guide on ${message} the form of (with no preambles or postambles):
                Title: How to ...
                Description: A step by step guide on how to ...
                1. ...
                2. ...
                3. ...
                ...
                `
            }],
            max_tokens: 750,
        })
    }
    try {
        console.log('step 1')
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        console.log('step 2')
        const data = await response.json();
        console.log('step 3')
        console.log(data);
        return data;
    }
    catch (error) {
        console.log(error);
    }
}

// Parse through API response to create roadmap object
function createRoadmapObject(message) {
    var roadmapObject = {
        title: "",
        description: "",
        steps: []
    };
    console.log('step 5')
    var messageArray = message.split("\n").filter(line => line.length > 0);
    console.log('step 6')
    roadmapObject.title = messageArray[0].split(": ")[1];
    console.log('step 7')
    roadmapObject.description = messageArray[1].split(": ")[1];
    console.log('step 8')

    for (var i = 2; i < messageArray.length; i++) {
        console.log(`step 8.${i}`)
        roadmapObject.steps.push(messageArray[i].split(". ")[1]);
    }

    return roadmapObject;
}

// Send request to OpenAI API and return roadmap object
app.post('/sendRequest', async (req, res) => {
    var userInput = req.body.hiddenField || req.body.textInput;

    let returnMessage = await getMessage(userInput);
    console.log('step 4')
    let roadmapObject = createRoadmapObject(returnMessage.choices[0].message.content);
    console.log('step 9')
    console.log(roadmapObject)
    res.render('./main.ejs', {
        step1: roadmapObject.steps[0],
        step2: roadmapObject.steps[1],
        step3: roadmapObject.steps[2],
        step4: roadmapObject.steps[3]
    });

});

module.exports = app;