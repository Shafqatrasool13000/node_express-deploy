const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const { BadRequestError } = require("../errors");
const { validationResult } = require("express-validator");
const { appData } = require("../utils/appData");

const getAllUsers = async (req, res) => {
    const { pageNo } = req.query;

    let currentPage = +pageNo || 1;
    let perPage = 10;
    const totalItems = await User.find().countDocuments();
    let totalPages = Math.ceil(totalItems / perPage);

    const users = await User.find({}).skip((currentPage - 1) * perPage).limit(perPage);

    res.status(StatusCodes.OK).json({
        responseMessage: "Record Fetched Successfully",
        results: {
            totalItems,
            totalPages,
            currentPage,
            userCount: users.length,
            users,
        }
    });
}

const getUserDetails = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new BadRequestError(`user with id ${userId} not found`);
    }
    res.status(StatusCodes.OK).json({
        responseMessage: "Record Fetched Successfully",
        results: {
            user
        }
    });
}

const searchUser = async (req, res) => {
    const searchQuery = req.body.keyword || "";
    const searchResults = await User.find({
        $or: [
            { userName: { $regex: searchQuery, $options: 'i' } },
        ],
    });
    res.status(StatusCodes.OK).json({
        responseMessage: "Record Fetched Successfully",
        results: {
            searchResults
        }
    });
}

const updateUserStatus = async (req, res) => {
    const { userId, statusId } = req.body;
    const user = await User.findOne({ _id: userId });
    const isStatusExist = appData.statusList.user.find(({ id }) => id === statusId);

    if (!user) {
        throw new BadRequestError(`user with ${userId} not found`)
    }

    if (!isStatusExist) {
        throw new BadRequestError(`status id ${statusId} is invalid`)
    }
    user.userStatusId = statusId;
    await user.save()

    res.status(StatusCodes.OK).jso({
        responseMessage: "Status Updated Successfully",
        results: {
            user
        }
    });
}

const updateUser = async (req, res) => {
    const { firstName, lastName, userId } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const user = await User.findOne({ _id: userId });

    user.firstName = firstName;
    user.lastName = lastName;
    user.userId = userId;
    res.status(StatusCodes.OK).json({
        responseMessage: "Record Updated Successfully",
        results: {
            user
        }
    });
}

module.exports = {
    getAllUsers,
    getUserDetails,
    searchUser,
    updateUserStatus,
    updateUser
}