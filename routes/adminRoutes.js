const express = require('express');
const { body } = require('express-validator');
const { getAllUsers, getUserDetails, searchUser, updateUserStatus, updateUser } = require('../controllers/adminController');
const { validationFinder } = require('../utils/utils');

const router = express.Router();

// signin Validation
const getDetailsValidation = [
    body('userId').notEmpty().withMessage("userId is required").isString().withMessage("userId should be string").trim(),
];

// user status validation
const statusUpdateValidation = [
    body('userId').notEmpty().withMessage("userId is required").isString().withMessage("userId should be string").trim(),
    body('status').notEmpty().withMessage("status is required").isNumeric().withMessage("status should be string").trim(),
];

// user status validation
const updateUserValidation = [
    body('userId').notEmpty().withMessage("userId is required").isString().withMessage("userId should be string").trim(),
    body('firstName', validationFinder('USER_FIRSTNAME').patternMsg).trim().notEmpty().withMessage(validationFinder('USER_FIRSTNAME').notBlankMsg).matches(validationFinder('USER_FIRSTNAME').pattern),
    body('lastName', validationFinder('USER_LASTNAME').patternMsg).trim().notEmpty().withMessage(validationFinder('USER_LASTNAME').notBlankMsg).matches(validationFinder('USER_LASTNAME').pattern),
];

router.post('/user/getAllUsers', getAllUsers);
router.post('/user/getdetails', getDetailsValidation, getUserDetails);
router.post('/user/search', searchUser);
router.patch('/user/updateStatus', statusUpdateValidation, updateUserStatus);
router.put('/user/updateUser', updateUserValidation, updateUser);


module.exports = router;