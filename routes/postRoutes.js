const express = require('express');
const { body, param } = require('express-validator');
const { createPostController, deletePostController, editPostController, postDetailsController,
    postListController } = require('../controllers/postControllers');
const { multerMiddleware } = require('../utils/multer.config');

const router = express.Router();

// post detail Validation
const postDetailValidation = [
    param('postId').notEmpty().withMessage("postId is required").isString().withMessage("postId should be string").trim(),
];
// post delete Validation
const postDeleteValidation = [
    body('postId').notEmpty().withMessage("postId is required").isString().withMessage("postId should be string").trim(),
];
router.post('/create', multerMiddleware.fields([{ name: 'images', maxCount: 12 }, { name: 'video', maxCount: 1 }]), createPostController);
router.post('/edit', multerMiddleware.fields([{ name: 'images', maxCount: 12 }, { name: 'video', maxCount: 1 }]), editPostController);
router.delete('/delete', postDeleteValidation, deletePostController);
router.get('/list', postListController);
router.get('/:postId', postDetailValidation, postDetailsController);

module.exports = router;

