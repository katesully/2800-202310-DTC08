const app = require('./app.js');
require('dotenv').config();
const mime = require('mime');
const express = require('express');
const mongoose = require('mongoose');


async function main() {
    // make sure you add database name in the connection string
    await mongoose.connect('mongodb://127.0.0.1:27017/newjourney');
    // await mongoose.connect(`mongodb+srv://${process.env.ATLAS_DB_USERNAME}:${process.env.ATLAS_DB_PASSWORD}@cluster1.ncanyuw.mongodb.net/comp2537w2?retryWrites=true&w=majority`);
    console.log(`server.js: Successfully connected to MongoDB Database.`);
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server.js: Server is running on port ${process.env.PORT} and listening for HTTP requests`);
    })
    // Check if the connection is successful by checking the value of mongoose.connection.readyState
    console.log("server.js: mongoose.connection.readyState (0 = disconnected; 1 = connected):", mongoose.connection.readyState);
    
    //this was written by Oceaan with help from chatGPT to resolve the issue of the signup.js file not being found
    app.use('/scripts', express.static(__dirname + '/scripts', {
        setHeaders: function (res, path) {
            if (mime.getType(path) === 'text/javascript') {
                res.setHeader('Content-Type', 'application/javascript');
            }
        }
    }));
  }
  
  
  main().catch(err => console.log(err));
  