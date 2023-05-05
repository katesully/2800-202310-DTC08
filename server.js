const app = require('./app.js');
require('dotenv').config();
const mime = require('mime');
const express = require('express');

app.listen(process.env.PORT || 3000, () => {
    console.log(`server.js: Server is running on port 3000 and listening for HTTP requests`);
})

//this was written by Oceaan with help from chatGPT to resolve the issue of the signup.js file not being found
app.use('/scripts', express.static(__dirname + '/scripts', {
    setHeaders: function (res, path) {
        if (mime.getType(path) === 'text/javascript') {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));
