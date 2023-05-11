// const app = require('./app.js');
// const mime = require('mime');
// const express = require('express');
import { app } from './app.js';
import mime from 'mime';
import express from 'express';
// require('dotenv').config();
import dotenv  from "dotenv"
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
