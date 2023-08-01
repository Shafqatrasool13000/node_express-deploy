const express = require('express');
const { signup, signin, generateOtp,
    verifyOtp } = require('../controllers/authController');
const { body } = require('express-validator');
const { validationFinder } = require('../utils/utils.js');

const router = express.Router();

// sinup validations
const signupValidations = [
    body('firstName', validationFinder('USER_FIRSTNAME').patternMsg).trim().notEmpty().withMessage(validationFinder('USER_FIRSTNAME').notBlankMsg).matches(validationFinder('USER_FIRSTNAME').pattern),
    body('lastName', validationFinder('USER_LASTNAME').patternMsg).trim().notEmpty().withMessage(validationFinder('USER_LASTNAME').notBlankMsg).matches(validationFinder('USER_LASTNAME').pattern),
    body('emailAddress', validationFinder('EMAIL_ADDRESS').patternMsg).isEmail().normalizeEmail().trim().notEmpty().withMessage(validationFinder('EMAIL_ADDRESS').notBlankMsg).matches(validationFinder('EMAIL_ADDRESS').pattern),
    body('phoneNumber', validationFinder('PHONE_NUMBER').notBlankMsg).trim().notEmpty().withMessage(validationFinder('PHONE_NUMBER').notBlankMsg).matches(validationFinder('PHONE_NUMBER').pattern),
    body('username', validationFinder('USER_NAME').notBlankMsg).trim().notEmpty().withMessage(validationFinder('USER_NAME').notBlankMsg).matches(validationFinder('USER_NAME').pattern),
    body('password', validationFinder('PASSWORD').patternMsg).trim().notEmpty().withMessage(validationFinder('PASSWORD').notBlankMsg).matches(validationFinder('PASSWORD').pattern)
];

// signin Validations
const loginValidations = [
    body('username', validationFinder('USER_NAME').patternMsg).trim().notEmpty().withMessage(validationFinder('USER_NAME').notBlankMsg).matches(validationFinder('USER_NAME').pattern),
    body('password', validationFinder('PASSWORD').patternMsg).trim().notEmpty().withMessage(validationFinder('PASSWORD').notBlankMsg).matches(validationFinder('PASSWORD').pattern)
]

router.post('/generate-otp', signupValidations, generateOtp);
router.post('/verify-otp', signupValidations, verifyOtp);
router.post('/signup', signupValidations, signup);
router.post('/signin', loginValidations, signin);
// router.post('/refresh-token', loginValidations, refreshToken);
// router.post('/uploadProfilePicture', loginValidations, refreshToken);
// router.post('/resetPassword', loginValidations, refreshToken);


module.exports = router;