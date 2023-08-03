const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv/config')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    emailAddress: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String,
        trim: true
    },
    country: { type: String, default: 'Pakistan', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, default: null, trim: true },
    profilePicture: { type: String, default: null, trim: true },
    countryCode: { type: String, default: null, trim: true },
    deletedDateTime: { type: Date, default: null, trim: true },
    isDeleted: { type: Boolean, default: false, trim: true },
    userStatusId: { type: Number, default: 1, trim: true },
    updatedBy: { type: String, default: null, trim: true },
}, {
    timestamps: true
});


UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, userName: this.userName },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.TOKEN_LIFETIME,
        }
    )
}

UserSchema.methods.comparePassword = async function (createdPassword) {
    const passwordComparison = await bcrypt.compare(createdPassword, this.password);
    return passwordComparison;
};

module.exports = mongoose.model('User', UserSchema)