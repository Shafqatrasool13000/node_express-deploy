const express = require('express');
const { signup, login } = require('../controllers/user');
const { body } = require('express-validator');


const router = express.Router();

// sinup validations
const signupValidations = [
    body('firstName', 'First Name is Required').trim().notEmpty(),
    body('lastName', 'Last Name is Required').trim().notEmpty(),
    body('emailAddress', 'Email is Required').isEmail().normalizeEmail().trim().notEmpty(),
    body('phoneNumber', "Phone Numberis Invalid").trim().matches(/^\d{10}$/),
    body('username', "Username is Required").trim().notEmpty(),
    body('password', "Password is Required").trim().notEmpty()
]
// log Validations
const loginValidations = [
    body('username', "Username is Required").trim().notEmpty(),
    body('password', "Password is Required").trim().notEmpty()
]

router.post('/signup', signupValidations, signup);
router.post('/login', loginValidations, login);


module.exports = router;