const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
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
    imageUrls: [{
        type: String,
        trim: true,
        required: true
    }],
    videoUrl: {
        type: String,
        trim: true,
        required: true
    }

});

module.exports = mongoose.model('Post', PostSchema)