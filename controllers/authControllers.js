const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const otpGenerator = require('otp-generator')
const { StatusCodes } = require('http-status-codes')
const { UnauthenticatedError } = require('../errors')

const generateOtp = () => {
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
}

const verifyOtp = (req, res) => {
    const { otp } = req.body;
    if (otp == 1111) {
        res.status(StatusCodes.OK).send({
            "responseCode": "200",
            "responseMessage": "Otp verified successfully",
            "execTime": 172,
            "errors": null,
            "results": null
        })
    }
    res.status(StatusCodes.BAD_REQUEST).send({
        "responseCode": "422",
        "responseMessage": "Bad credentials",
        "execTime": 116,
        "errors": null,
        "results": null
    })

}

// sigup controller
const signup = async (req, res) => {
    const {
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        userName,
        password
    } = req.body;

    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status and the error messages
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const userExist = await User.findOne({ $or: [{ emailAddress }, { userName }, { phoneNumber }], });
    if (userExist) {
        return res.status(StatusCodes.CONFLICT).json({ message: 'User with the provided email,phone or username already exists.' });
    }

    // Create a new user instance based on the User model
    const newUser = new User({
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        userName,
        password,
    });
    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(StatusCodes.CREATED).json({
        user: savedUser
    })
}

// sigin controller
const signin = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const {
        userName,
        password
    } = req.body;


    const userExist = await User.findOne({ userName });

    if (userExist) {
        // compare password
        const matchPassword = await userExist.comparePassword(password);

        if (!matchPassword) {
            throw new UnauthenticatedError('Invalid Credentials')
        }

        if (matchPassword) {
            const token = userExist.createJWT();
            return res.status(StatusCodes.OK).json({
                "responseMessage": "You have successfully logged in.",
                "results": {
                    "tourGuide": {
                        "story": true,
                        "post": true,
                        "property": true,
                        "professional": true
                    },
                    "ProfessionalDetails": null,
                    "jwtDetails": {
                        token,
                        "refreshToken": "a8b8db83-501f-4577-baa6-6abd5dd56db8",
                        "type": "Bearer"
                    },
                    "planSubscriptionDetails": {
                        "planId": null,
                        "subscriptionDate": null,
                        "expiryDate": null,
                        "isExpired": null,
                        "availablePlans": null
                    },
                    "userDetails": {
                        "id": userExist._id,
                        "username": userName,
                        "userSecretId": "2ca9312e-e763-465b-9141-53affecb3e60-2124d73b-73c5-4bb4-9f95-5c1ca725b62a",
                        "email": "info@houseup.ca",
                        "phoneNumber": "9052593363",
                        "profileImageURL": "/ennvisions/ennvision_users/profile_images/c79f3206-db19-4af6-9c41-c585d7adbef0.png",
                        "userFirstName": "HouseUp",
                        "userLastName": "Offical",
                        "countryCode": "+1"
                    }
                }
            })
        }
    }

    res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid Email or Password' });
}

module.exports = {
    signup, signin, generateOtp,
    verifyOtp
}