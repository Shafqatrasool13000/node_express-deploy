const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');

// image storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

// multer mimetype configuration
const fileFilter = (req, file, cb) => {

    if (appData.multiPartLimits.imagesAllowedFormatList.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false)
    }

}

const upload = multer({ storage: storage, fileFilter });
const { userUploadProfileController, deleteUserController } = require('../controllers/userController');
const { appData } = require('../utils/appData');
const router = express.Router();

// userId Validation
const userIdValidation = [
    body('userId').notEmpty().withMessage("userId is required").isString().withMessage("userId should be string").trim(),
];

router.post('/uploadProfilePicture', upload.single('profilePicture'), userIdValidation, userUploadProfileController);

router.delete('/deleteUser', userIdValidation, deleteUserController);


module.exports = router;