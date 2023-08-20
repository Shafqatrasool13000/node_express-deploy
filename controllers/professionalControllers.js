const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const Professional = require('../models/professionalModal');
const { fileUrlCleaner } = require('../utils/file');
const { validationResult } = require('express-validator');
const { BadRequestError } = require('../errors');

// edit professionl validation schema
const editProfessionalValidationSchema = Joi.object({
    address: Joi.string().required().messages({
        'string.base': 'Address should be a string',
        'string.empty': 'Address cannot be empty',
        'any.required': 'Address is required',
    }),
    professionTypeId: Joi.number().required().messages({
        'number.base': 'professionTypeId should be a number'
    }),
    bussinessName: Joi.string().required().messages({
        'string.base': 'bussinessName should be a string',
        'string.empty': 'bussinessName cannot be empty',
        'any.required': 'bussinessName is required',
    }),
    businessStartedDate: Joi.date().required().messages({
        'string.base': 'businessStartedDate should be a string',
        'string.empty': 'businessStartedDate cannot be empty',
        'any.required': 'businessStartedDate is required',
    }),
    businessRegisterNumber: Joi.number().required().messages({
        'number.base': 'businessRegisterNumber should be a number',
        'any.required': 'businessRegisterNumber is required',
    }),
    longitude: Joi.number().required().messages({
        'number.base': 'Longitude should be a number',
        'any.required': 'Longitude is required',
    }),
    latitude: Joi.number().required().messages({
        'number.base': 'Latitude should be a number',
        'any.required': 'Latitude is required',
    }),
    businessRegisterDocUrl: Joi.string().messages({
        'string.base': 'businessRegisterDocUrl should be a string',
        'string.empty': 'businessRegisterDocUrl cannot be empty',
    }),
    idProfDocUrl: Joi.string().messages({
        'string.base': 'idProfDocUrl should be a string',
        'string.empty': 'idProfDocUrl cannot be empty',
    }),
    businessRegisterDocEdited: Joi.boolean().required().messages({
        'boolean.base': 'businessRegisterDocEdited should be a string',
        'any.required': 'businessRegisterDocEdited is required',
    }),
    idProfDocEdited: Joi.boolean().required().messages({
        'boolean.base': 'idProfDocEdited should be a string',
        'any.required': 'idProfDocEdited is required',
    }),
});

// professsional details controller
const professionalDetailsController = async (req, res) => {
    res.send('pro details')
}
// edit professsional controller
const updateProfessionalController = async (req, res) => {
    const businessRegisterDoc = req.files.businessRegisterDoc;
    const idProfDoc = req.files.idProfDoc;

    const { userId } = req.user;

    if (Object.keys(req.body).length === 0) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Professional data is required" });
    }
    const professionalData = JSON.parse(req.body.data);

    // Validate the JSON data using Joi schema
    const { error, value } = editProfessionalValidationSchema.validate(professionalData);
    // checking for validation errors
    if (error) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: error.details[0].message });
    }

    const { businessRegisterDocEdited, businessRegisterDocUrl, idProfDocEdited, idProfDocUrl } = professionalData;

    // validation for image file
    if (!businessRegisterDoc && !businessRegisterDocEdited) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: "businessRegisterDoc is required" });
    }

    // validation for video file
    if (!idProfDoc && !idProfDocEdited) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: "idProfDoc is required" });
    }
    // storing images url at once
    const businessRegisterDocPath = businessRegisterDocEdited ? businessRegisterDocUrl : fileUrlCleaner(businessRegisterDoc[0].path);
    const idProfDocPath = idProfDocEdited ? idProfDocUrl : fileUrlCleaner(idProfDoc[0].path);

    // new post creation
    const newProfessional = new Professional(professionalData);
    newProfessional.businessRegisterDoc = businessRegisterDocPath;
    newProfessional.idProfDoc = idProfDocPath;

    // find existing user to save postId
    const isProfessional = await Professional.findOne({ userId });

    if (!isProfessional) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "You are not Professional" });
    }

    await newProfessional.save();
    res.status(StatusCodes.OK).json({
        responseMessage: 'Update Professional Successfully',
        results: newProfessional,

    });
}
// search professional controller
const searchProfessionalController = async (req, res) => {
    console.log(req.body, 'body of search')
    const keyword = req.body.keyword || "";
    const professionTypeId = req.body.professionTypeId || 1;
    const searchResults = await Professional.find({
        $or: [
            { bussinessName: { $regex: keyword, $options: 'i' } },
            { professionTypeId },
        ],
    });
    res.status(StatusCodes.OK).json({
        responseMessage: "Record Fetched Successfully",
        results: {
            professionals: searchResults
        }
    });
}
// delete professsional controller
const deleteProfessionalController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { professionalId } = req.params;
    const user = await Professional.findByIdAndRemove(professionalId);
    if (!user) {
        throw new BadRequestError(`professional with id ${professionalId} not found`);
    }
    res.status(StatusCodes.OK).json(
        {
            responseMessage: "Professional deleted successfully",
        }
    );
}
// get all professsional controller
const getAllProfessionalsController = async (req, res) => {
    const { pageNo } = req.query;

    let currentPage = +pageNo || 1;
    let perPage = 10;
    const totalItems = await Professional.find().countDocuments();
    let totalPages = Math.ceil(totalItems / perPage);

    const professionals = await Professional.find({}).skip((currentPage - 1) * perPage).limit(perPage);

    res.status(StatusCodes.OK).json({
        responseMessage: "Record Fetched Successfully",
        results: {
            totalItems,
            totalPages,
            currentPage,
            professionalCount: totalItems,
            professionals,
        }
    });
}

module.exports = {
    professionalDetailsController,
    updateProfessionalController,
    deleteProfessionalController,
    getAllProfessionalsController,
    searchProfessionalController
}