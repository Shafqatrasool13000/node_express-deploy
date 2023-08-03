const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const { BadRequestError } = require("../errors");
const { validationResult } = require("express-validator");

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

module.exports = {
    userUploadProfileController, deleteUserController
}