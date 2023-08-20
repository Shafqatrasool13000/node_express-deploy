const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const Professional = require("../models/professionalModal");
const Post = require('../models/postModal');
const { BadRequestError } = require("../errors");
const { validationResult } = require("express-validator");
const { deleteFile } = require("../utils/file");
const { fileUrlCleaner } = require('../utils/file');
const Joi = require('joi');

// upload profile controller
const userUploadProfileController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { userId } = req.body;

    if (!req.file) {
        throw new BadRequestError('image file is missing')
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new BadRequestError(`user with id ${userId} not found`);
    }
    deleteFile(user.profilePicture);
    const profilePictureUrl = req.file.path.replace(/\\/g, '/');

    user.profilePicture = profilePictureUrl;
    await user.save()

    res.status(StatusCodes.OK).json(
        {
            responseMessage: "profile picture saved successfully",
            results: user
        }
    );
}

// delete user controller
const deleteUserController = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { userId } = req.body;
    const user = await User.findByIdAndRemove(userId);
    if (!user) {
        throw new BadRequestError(`user with id ${userId} not found`);
    }
    res.status(StatusCodes.OK).json(
        {
            responseMessage: "User deleted successfully",
        }
    );
}

// become professionl validation schema
const becomeProfessionalValidationSchema = Joi.object({
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
    })
});

// become professional controller
const becomeProfessionalController = async (req, res) => {
    const businessRegisterDoc = req.files.businessRegisterDoc;
    const idProfDoc = req.files.idProfDoc;

    const { userId } = req.user;

    if (Object.keys(req.body).length === 0) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Professional data is required" });
    }
    const professionalData = JSON.parse(req.body.data);

    // Validate the JSON data using Joi schema
    const { error, value } = becomeProfessionalValidationSchema.validate(professionalData);
    // checking for validation errors
    if (error) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: error.details[0].message });
    }

    console.log({ businessRegisterDoc, idProfDoc, professionalData })

    // validation for image file
    if (!businessRegisterDoc) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: "businessRegisterDoc is required" });
    }

    // validation for video file
    if (!idProfDoc) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: "idProfDoc is required" });
    }
    // storing images url at once
    const businessRegisterDocPath = businessRegisterDoc ? fileUrlCleaner(businessRegisterDoc[0].path) : [];
    const idProfDocPath = idProfDoc ? fileUrlCleaner(idProfDoc[0].path) : [];

    // new post creation
    const newProfessional = new Professional(professionalData);
    newProfessional.businessRegisterDoc = businessRegisterDocPath;
    newProfessional.idProfDoc = idProfDocPath;
    newProfessional.userId = userId;

    // find existing user to save postId
    const isProfessional = await Professional.findOne({ userId });

    if (isProfessional) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Already Professional" });
    }

    await newProfessional.save();
    res.status(StatusCodes.OK).json({
        responseMessage: 'Become Professional Successfully',
        results: newProfessional,

    });
}

module.exports = {
    userUploadProfileController, becomeProfessionalController, deleteUserController
}