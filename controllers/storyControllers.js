const Story = require('../models/storyModal');
const { StatusCodes } = require('http-status-codes')
const Joi = require('joi');
const User = require('../models/userModel');
const { fileUrlCleaner } = require('../utils/file');
const { validationResult } = require('express-validator');
const { BadRequestError } = require('../errors');

// story validation schema
const storyValidationSchema = Joi.object({
    storyText: Joi.string().trim().allow('').messages({
        'string.base': 'Story text should be a string'
    }),
    longitude: Joi.number().required().messages({
        'number.base': 'Longitude should be a number',
        'any.required': 'Longitude is required',
    }),
    latitude: Joi.number().required().messages({
        'number.base': 'Latitude should be a number',
        'any.required': 'Latitude is required',
    }),
    address: Joi.string().required().messages({
        'string.base': 'Address should be a string',
        'string.empty': 'Address cannot be empty',
        'any.required': 'Address is required',
    }),
    city: Joi.string().required().messages({
        'string.base': 'City should be a string',
        'string.empty': 'City cannot be empty',
        'any.required': 'City is required',
    }),
    state: Joi.string().required().messages({
        'string.base': 'State should be a string',
        'string.empty': 'State cannot be empty',
        'any.required': 'State is required',
    }),
    country: Joi.string().required().messages({
        'string.base': 'Country should be a string',
        'string.empty': 'Country cannot be empty',
        'any.required': 'Country is required',
    }),
    contactRequestPermission: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'Contact request permission should be a boolean',
        'any.required': 'Contact request permission is required',
    }),
    boostPermission: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'Boost permission should be a boolean',
        'any.required': 'Boost permission is required',
    }),
    saveFavourite: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'Save favourite should be a boolean',
        'any.required': 'Save favourite is required',
    }),
    sharingEnabled: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'Sharing enabled should be a boolean',
        'any.required': 'Sharing enabled is required',
    }),
    turnOffCommenting: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'Turn off commenting should be a boolean',
        'any.required': 'Turn off commenting is required',
    }),
    readComments: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'Read comments should be a boolean',
        'any.required': 'Read comments is required',
    }),
    hideLikesAndViewsCounts: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'Hide likes and views counts should be a boolean',
        'any.required': 'Hide likes and views counts is required',
    })
});

// create story controller
const createStoryController = async (req, res, isError) => {
    const { userId } = req.user;

    if (Object.keys(req.body).length === 0) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "data is required" });
    }
    const storyData = JSON.parse(req.body.data);

    // Validate the JSON data using Joi schema
    const { error, value } = storyValidationSchema.validate(storyData);
    // checking for validation errors
    if (error) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: error.details[0].message });
    }

    const storyText = storyData.storyText.trim();

    if (!req.file && !storyText) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: "File is Required" });
    }

    let imageUrl = null;
    let videoUrl = null;

    // check only if story text is empty
    if (!storyText) {
        // checking file type either video or image
        const fileType = req.file.mimetype.split('/')[0];
        const fileUrl = fileUrlCleaner(req.file.path);
        if (fileType === 'image') {
            imageUrl = fileUrl
        } else {
            videoUrl = fileUrl
        }
    }

    // new story creation
    const newStory = new Story(storyData);
    // do only if story text is empty
    if (!storyText) {
        newStory.imageUrl = imageUrl;
        newStory.videoUrl = videoUrl;
    }
    newStory.creator = userId;
    // find existing user to save story id to it
    const existedUser = await User.findOne({ _id: userId });
    await existedUser.stories.push(newStory);
    await existedUser.save();
    await newStory.save();

    res.status(StatusCodes.OK).json({
        responseMessage: 'Story Created Successfully',
        results: {
            story: newStory,
        }
    })
}

// delete story controller
const deleteStoryController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { user: { userId }, body: { storyId } } = req;

    const ownedStory = await Story.findOne({ creator: userId, _id: storyId });
    if (!ownedStory) {
        throw new BadRequestError(`Story with id ${storyId} not found`);
    }
    const existedUser = await User.findById(userId);
    await Story.findByIdAndRemove(storyId);
    existedUser.stories.pull(storyId);
    await existedUser.save();

    res.status(StatusCodes.OK).json(
        {
            responseMessage: "Story deleted successfully",
        }
    );

}

// post list controller
const storyListController = async (req, res) => {

    const { user: { userId } } = req;
    const stories = await Story.find({ creator: userId });
    res.status(StatusCodes.OK).json(
        {
            responseMessage: "Stories Record Fetched successfully",
            stories
        }
    );
}
module.exports = {
    createStoryController,
    deleteStoryController,
    storyListController
}