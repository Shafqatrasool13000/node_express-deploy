const express = require('express');
const { body } = require('express-validator');
const { createPostController, deletePostController, editPostController, postDetailsController,
    postListController } = require('../controllers/postControllers');
const { validationFinder } = require('../utils/utils');
const { multerImageMiddleware, multerVideoMiddleware } = require('../utils/multer.config');

const router = express.Router();

// post validations
const postValidation = [
    body('userId').notEmpty().withMessage("userId is required").isString().withMessage("userId should be string").trim(),
    body('firstName', validationFinder('USER_FIRSTNAME').patternMsg).trim().notEmpty().withMessage(validationFinder('USER_FIRSTNAME').notBlankMsg).matches(validationFinder('USER_FIRSTNAME').pattern),
];
const deletePostValidation = [
    body('userId').notEmpty().withMessage("userId is required").isString().withMessage("userId should be string").trim(),
    body('firstName', validationFinder('USER_FIRSTNAME').patternMsg).trim().notEmpty().withMessage(validationFinder('USER_FIRSTNAME').notBlankMsg).matches(validationFinder('USER_FIRSTNAME').pattern),
];

router.post('/create', multerImageMiddleware.array('images', 12), multerVideoMiddleware.single('videos'), createPostController);
router.put('/edit', multerImageMiddleware.array('images', 12), editPostController);
router.post('/:postId', postDetailsController);
router.delete('/delete', deletePostController);
router.post('/list', postListController);

module.exports = router;

