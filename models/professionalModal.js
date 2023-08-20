const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv/config')

const ProfessonalSchema = new mongoose.Schema({
    businessRegisterDoc: {
        type: String,
        trim: true,
        required: true,
    },
    idProfDoc: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    professionTypeId: {
        type: Number,
        required: true,
    },
    bussinessName: {
        type: String,
        required: true,
        trim: true
    },
    businessStartedDate: {
        type: Date,
        required: true,
    },
    businessRegisterNumber: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Professional', ProfessonalSchema)