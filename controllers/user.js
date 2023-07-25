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
    const userExist = await User.findOne({ emailAddress, username });
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

const login = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new Error("Error Happened in LoggedIN ");

        return res.status(400).json({ errors: errors.array() });
    }

    const existedUser = await User.findOne({ username });

    if (existedUser) {
        const matchPassword = await bcrypt.compare(password, existedUser.password);
        if (matchPassword) {
            res.status(200).json({ msg: "Login Sucessfully" })
        } else {
            return res.status(404).json({ message: 'Invalid Email or Password' });
        }
    }
}

module.exports = {
    signup, login
}