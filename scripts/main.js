// const axios = require('axios');
//import dotenv from 'dotenv';
// const dotenv = require('dotenv');
// require('dotenv').config()
// const API_KEY = process.env.OPENAI_API_KEY;
const API_KEY = "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"
const submitBtn = document.getElementById('submitBtn');

async function getMessage() {
    console.log('clicked');
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello!" }],
            max_tokens: 100,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json();
        console.log(data);
    }
    catch (error) {
        console.log(error);
    }
}

submitBtn.addEventListener('click', getMessage);


// const API_KEY = 'your_api_key_here';
// const API_URL = 'https://api.chatgpt.com/v1/';

// axios.get(API_URL + 'chat', {
//     headers: {
//         Authorization: `Bearer ${API_KEY}`
//     },
//     params: {
//         message: 'Hello, ChatGPT! How are you'
//     }
// })
//     .then(response => {
//         console.log(response.data);
//     })
//     .catch(error => {
//         console.log(error);
//     });