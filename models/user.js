const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    "firstName": {
        type: String,
        required: true,
        trim: true
    },
    "lastName": {
        type: String,
        required: true,
        trim: true
    },
    "emailAddress": {
        type: String,
        required: true,
        trim: true
    },
    "phoneNumber": {
        type: String,
        required: true,
        trim: true
    },
    "username": {
        type: String,
        required: true,
        trim: true
    },
    "password": {
        type: String,
        required: true,
        trim: true
    }


});

module.exports = mongoose.model('User', UserSchema)