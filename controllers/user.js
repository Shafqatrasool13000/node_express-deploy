const { validationResult } = require('express-validator');
const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    const {
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        username,
        password
    } = req.body;

    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status and the error messages
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userExist = await User.findOne({ $or: [{ emailAddress }, { username }], });
    if (userExist) {
        return res.status(409).json({ message: 'User with the provided email or username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create a new user instance based on the User model
    const newUser = new User({
        firstName,
        lastName,
        emailAddress,
        phoneNumber,
        username,
        password: hashedPassword,
    });
    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json({
        user: savedUser
    })
}

const signin = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const errors = validationResult(req);
    console.log(errors.array())

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const existedUser = await User.findOne({ username });

    if (existedUser) {
        const matchPassword = await bcrypt.compare(password, existedUser.password);
        if (matchPassword) {
            return res.status(200).json({
                "responseCode": "200",
                "responseMessage": "You have successfully logged in.",
                "execTime": 172,
                "errors": null,
                "results": {
                    "tourGuide": {
                        "story": true,
                        "post": true,
                        "property": true,
                        "professional": true
                    },
                    "ProfessionalDetails": null,
                    "jwtDetails": {
                        "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJob3VzZXVwIiwiaWF0IjoxNjkwMzU2ODQyLCJleHAiOjE2OTA1MjI0NDJ9.JTuYFk45mFJTgB9Vt2XOqqLjD_V_wmfJlVcAaUFf-MBTVHtz9ah2u9J56UhKMRi8sOFLcCPDw7EwgDVdvTZUQw",
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
                        "id": 2,
                        "username": "houseup",
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
    res.status(404).json({ message: 'Invalid Email or Password' });
}

module.exports = {
    signup, signin
}