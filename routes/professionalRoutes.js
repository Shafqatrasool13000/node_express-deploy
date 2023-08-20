const express = require('express');
const { param, body } = require('express-validator');
const { multerMiddleware } = require('../utils/multer.config');

const { professionalDetailsController,
    updateProfessionalController,
    deleteProfessionalController,
    getAllProfessionalsController, searchProfessionalController } = require('../controllers/professionalControllers');

const router = express.Router();

// professionalId Validation
const professionalIdValidation = [
    param('professionalId').notEmpty().withMessage("professional id required").isString().withMessage("professional id should be string").trim(),
];



// search professional Validation
const searchProfessionalValidation = [
    body('keyword').notEmpty().withMessage("keyword required").isString().withMessage("keyword should be string").trim(),
    body('professionTypeId').notEmpty().withMessage("professionTypeId is required").isNumeric().withMessage("professionTypeId should be number"),
];

router.patch('/edit/:professionalId', multerMiddleware.fields([{ name: 'businessRegisterDoc', maxCount: 1 }, { name: 'idProfDoc', maxCount: 1 }]), professionalIdValidation, updateProfessionalController);
router.delete('/delete/:professionalId', professionalIdValidation, deleteProfessionalController);
router.get('/list', getAllProfessionalsController);
router.post('/search', searchProfessionalValidation, searchProfessionalController);
router.get('/:professionalId', professionalIdValidation, professionalDetailsController);


module.exports = router;