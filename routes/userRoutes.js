const express = require('express');
const { body } = require('express-validator');

const { userUploadProfileController, deleteUserController, becomeProfessionalController } = require('../controllers/userControllers');
const { multerMiddleware } = require('../utils/multer.config');

const router = express.Router();

// userId Validation
const userIdValidation = [
    body('userId').notEmpty().withMessage("userId is required").isString().withMessage("userId should be string").trim(),
];

router.post('/uploadProfilePicture', multerMiddleware.single('profilePicture'), userIdValidation, userUploadProfileController);
router.post('/becomeProfessional', multerMiddleware.fields([{ name: 'businessRegisterDoc', maxCount: 1 }, { name: 'idProfDoc', maxCount: 1 }]), becomeProfessionalController);
router.delete('/deleteUser', userIdValidation, deleteUserController);


module.exports = router;