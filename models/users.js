// for mongoose schemas and models
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    // "username": String,
    "username": {
        type: String,
        required: true,
        unique: true
    },
    "password": String,
    "type": String,
    "email": String,
    "city": String,
    "savedRoadmaps": {
        type: Array,
        default: []
    }

});

const usersModel = mongoose.model('user', usersSchema)

module.exports = usersModel;