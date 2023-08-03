const express = require('express');
const { body } = require('express-validator');
const { validationFinder } = require('../utils/utils');
const { multerImageMiddleware, multerVideoMiddleware } = require('../utils/multer.config');
const { createStoryController, deleteStoryController } = require('../controllers/storyControllers');

const router = express.Router();

// user status validation
const storyValidation = [
    body('userId').notEmpty().withMessage("userId is required").isString().withMessage("userId should be string").trim(),
    body('firstName', validationFinder('USER_FIRSTNAME').patternMsg).trim().notEmpty().withMessage(validationFinder('USER_FIRSTNAME').notBlankMsg).matches(validationFinder('USER_FIRSTNAME').pattern),
];

router.post('/create', multerImageMiddleware.array('images', 12), multerVideoMiddleware.single('video'), createStoryController);
router.delete('/delete', deleteStoryController);

module.exports = router;

