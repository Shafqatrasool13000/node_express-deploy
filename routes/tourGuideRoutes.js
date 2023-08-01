const app = require("express");
const { body } = require('express-validator');
const tourGuideController = require("../controllers/tourGuideController");

const router = app.Router();

// Custom validation function to check if the value is one of the allowed values
const isValidTourType = (value) => ['PROFESSIONAL', 'PROPERTY', 'POST', 'STORY'].includes(value);

// tourGuide Validations
const tourGuideValidation = [
    body('tourType').trim().notEmpty().withMessage('tourType cannot be blank').custom((value) => {
        if (!isValidTourType(value)) {
            throw new Error('Invalid tourType.');
        }
        return true;
    }),
];

router.post('/', tourGuideValidation, tourGuideController);

module.exports = router;