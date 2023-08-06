const express = require('express');
const { body } = require('express-validator');
const { multerMiddleware } = require('../utils/multer.config');
const { createStoryController, deleteStoryController, storyListController } = require('../controllers/storyControllers');

const router = express.Router();

// {
// 	"storyText": " ",
// 	"longitude": -79.4974186692864,
// 	"latitude": 43.78724659057179,
// 	"address": "7250 Keele St, Vaughan, ON L4K 1Z8, Canada",
// 	"city": "Vaughan",
// 	"state": "Ontario",
// 	"country": "Canada",
// 	"contactRequestPermission": "true",
// 	"boostPermission": "true",
// 	"saveFavourite": "true",
// 	"sharingEnabled": "true",
// 	"turnOffCommenting": "true",
// 	"readComments": "true",
// 	"hideLikesAndViewsCounts": "true"
// }

// user status validation
// const storyValidation = [
//     body('data.storyText').isString().withMessage("story text should be a string").trim(),
//     body('data.longitude').isNumeric().withMessage("longitude should be numeric").notEmpty().withMessage('longitude cannot be blank').trim(),
//     body('data.latitude').isNumeric().withMessage("latitude should be numeric").notEmpty().withMessage('latitude cannot be blank').trim(),
//     body('data.address').isString().withMessage("address should be a string").notEmpty().withMessage('address cannot be blank').trim(),
//     body('data.city').isString().withMessage("city should be a string").notEmpty().withMessage('city cannot be blank').trim(),
//     body('data.state').isString().withMessage("state should be a string").notEmpty().withMessage('state cannot be blank').trim(),
//     body('data.country').isString().withMessage("country should be a string").notEmpty().withMessage('country cannot be blank').trim(),
//     body('data.contactRequestPermission').isBoolean().withMessage("contactRequestPermission should be true or false").notEmpty().withMessage('contactRequestPermission cannot be blank').trim(),
//     body('data.boostPermission').isBoolean().withMessage("boostPermission should be true or false").notEmpty().withMessage('boostPermission cannot be blank').trim(),
//     body('data.saveFavourite').isBoolean().withMessage("saveFavourite should be true or false").notEmpty().withMessage('saveFavourite cannot be blank').trim(),
//     body('data.sharingEnabled').isBoolean().withMessage("sharingEnabled should be true or false").notEmpty().withMessage('sharingEnabled cannot be blank').trim(),
//     body('data.turnOffCommenting').isBoolean().withMessage("turnOffCommenting should be true or false").notEmpty().withMessage('turnOffCommenting cannot be blank').trim(),
//     body('data.readComments').isBoolean().withMessage("readComments should be true or false").notEmpty().withMessage('readComments cannot be blank').trim(),
//     body('data.hideLikesAndViewsCounts').isBoolean().withMessage("hideLikesAndViewsCounts should be true or false").notEmpty().withMessage('hideLikesAndViewsCounts cannot be blank').trim()

// ];
// story delete Validation
const storyValidation = [
    body('storyId').notEmpty().withMessage("storyId is required").isString().withMessage("storyId should be string").trim(),
];
router.post('/create', multerMiddleware.single('media'), createStoryController);
router.delete('/delete', storyValidation, deleteStoryController);
router.get('/list', storyValidation, storyListController);

module.exports = router;

