const express = require('express');
const getAppData = require('../controllers/utils');
const { body } = require('express-validator');
const { validationFinder } = require('../utils/utils');

const appDataValidation = body('countryName', validationFinder('COUNTRY_NAME').patternMsg).trim().notEmpty().withMessage(validationFinder('COUNTRY_NAME').notBlankMsg).matches(validationFinder('COUNTRY_NAME').pattern)

const router = express.Router();

router.route('/getAppData').post(appDataValidation, getAppData)

module.exports = router;