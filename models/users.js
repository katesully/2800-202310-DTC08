// for mongoose schemas and models
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    // "username": String,
    "username": {
        type: String,
        required: true,
        unique: true
    },
    "password": {
        type: String,
        required: true
    },
    "type": String,
    "email": {
        type: String,
        required: true,
        unique: true
    },

    "city": {
        type: String,
        required: true
    },
    "savedRoadmaps": {
        type: Array,
        default: []
    }

});

const usersModel = mongoose.model('user', usersSchema)

module.exports = usersModel;