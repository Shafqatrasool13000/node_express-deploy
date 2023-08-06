const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    storyText: {
        type: String,
        trim: true,
        default: null
    },
    latitude: {
        type: Number,
        required: true,
        trim: true
    },
    longitude: {
        type: Number,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    contactRequestPermission: {
        type: Boolean,
        default: true
    },
    boostPermission: {
        type: Boolean,
        default: true
    },
    saveFavourite: {
        type: Boolean,
        default: true
    },
    sharingEnabled: {
        type: Boolean,
        default: true
    },
    turnOffCommenting: {
        type: Boolean,
        default: false
    },
    readComments: {
        type: Boolean,
        default: true
    },
    hideLikesAndViewsCounts: {
        type: Boolean,
        default: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: {
        type: String,
        trim: true,
        default: null
    },
    videoUrl: {
        type: String,
        trim: true,
        default: null
    }

});

module.exports = mongoose.model('STORY', StorySchema)