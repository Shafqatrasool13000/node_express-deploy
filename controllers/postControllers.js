const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');
const Post = require('../models/postModal');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const { BadRequestError } = require('../errors');
const { fileUrlCleaner } = require('../utils/file');

// create post validation schema
const postValidationSchema = Joi.object({
    description: Joi.string().required().trim().messages({
        'string.base': 'Description should be a string'
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

// update post validation schema
const editPostValidationSchema = Joi.object({
    postId: Joi.string().required().trim().messages({
        'string.base': 'PostId should be a string'
    }),
    description: Joi.string().required().trim().messages({
        'string.base': 'Description should be a string'
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
    turnOffCommenting: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'Turn off commenting should be a boolean',
        'any.required': 'Turn off commenting is required',
    }),
    hideLikesAndViewsCounts: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'Hide likes and views counts should be a boolean',
        'any.required': 'Hide likes and views counts is required',
    }),
    isImagesEdited: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'isImagesEdited should be a boolean',
        'any.required': 'isImagesEdited is required',
    }),
    isVideoEdited: Joi.boolean().required().options({
        convert: false
    }).messages({
        'boolean.base': 'IsVideoEdited  should be a boolean',
        'any.required': 'IsVideoEdited is required',
    }),
    imageUrls: Joi.array().optional().options({
        convert: false
    }).messages({
        'array.base': 'imageUrls should be an array',
    }),
    videoUrl: Joi.string().allow("").messages({
        'string.base': 'videoUrl should be a string',
    })
});

// create Post controller
const createPostController = async (req, res) => {
    const imageFiles = req.files.images;
    const videoFile = req.files.video;

    const { userId } = req.user;

    if (Object.keys(req.body).length === 0) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Post data is required" });
    }
    const postData = JSON.parse(req.body.data);

    // Validate the JSON data using Joi schema
    const { error, value } = postValidationSchema.validate(postData);
    // checking for validation errors
    if (error) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: error.details[0].message });
    }

    // validation for image file
    if (!imageFiles) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: "At least one or more images are required" });
    }

    // validation for video file
    if (!videoFile) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: "Video file is required" });
    }
    // storing images url at once
    const imageFilesPath = imageFiles.map((imageUrl) => fileUrlCleaner(imageUrl.path));
    const videoFilePath = fileUrlCleaner(videoFile[0].path)

    // new post creation
    const newPost = new Post(postData);
    newPost.imageUrls = imageFilesPath;
    newPost.videoUrl = videoFilePath;
    newPost.creator = userId;

    // find existing user to save postId
    const existedUser = await User.findOne({ _id: userId });
    await existedUser.posts.push(newPost);
    await existedUser.save();
    await newPost.save();

    res.status(StatusCodes.OK).json({
        responseMessage: 'Post Created Successfully',
        results: {
            Post: newPost,
        }
    });
}

// update post controller
const editPostController = async (req, res) => {
    console.log("in post create")
    console.log(req.files, 'files of edit post')
    const imageFiles = req.files?.images;
    const videoFile = req.files?.video;


    const { userId } = req.user;

    if (Object.keys(req.body).length === 0) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Post data is required" });
    }
    const postData = JSON.parse(req.body.data);

    // Validate the JSON data using Joi schema
    const { error, value } = editPostValidationSchema.validate(postData);
    // checking for validation errors
    if (error) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: error.details[0].message });
    }

    const mediaAvailable = (!imageFiles && postData.imageUrls.length < 1) && (!videoFile && !postData.videoUrl);
    // validation for image file
    if (mediaAvailable) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: "At least one or more images are required" });
    }

    // validation for video file
    if (mediaAvailable) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: "Video file is required" });
    }
    // storing images url at once
    const imageFilesPath = imageFiles ? imageFiles.map((imageUrl) => fileUrlCleaner(imageUrl.path)) : [];
    const videoFilePath = videoFile ? fileUrlCleaner(videoFile[0].path) : "";


    let imagesUrls = [];
    let videoUrl = "";

    console.log(postData.imageUrls, 'image url in psot')

    // url paths for new and old images or videos
    if (imageFilesPath.length > 1) {
        imagesUrls.push(...imageFilesPath)
    }
    if (postData.imageUrls) {
        imagesUrls.push(...postData.imageUrls)
    }

    if (videoFilePath) {
        videoUrl = videoFilePath;
    } else {
        videoUrl = postData.videoUrl
    }


    // new post creation
    const newPost = new Post(postData);
    newPost.imageUrls = imagesUrls;
    newPost.videoUrl = videoUrl;
    newPost.creator = userId;
    await newPost.save();

    res.status(StatusCodes.OK).json({
        responseMessage: 'Post Created Successfully',
        results: {
            Post: newPost,
        }
    });

}

// delete Post controller
const deletePostController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { user: { userId }, body: { postId } } = req;

    const ownedPost = await Post.findOne({ creator: userId, _id: postId });
    if (!ownedPost) {
        throw new BadRequestError(`post with id ${postId} not found`);
    }
    const existedUser = await User.findById(userId);
    await Post.findByIdAndRemove(postId);
    existedUser.posts.pull(postId);
    await existedUser.save();

    res.status(StatusCodes.OK).json(
        {
            responseMessage: "Post deleted successfully",
        }
    );

}

// post details controller
const postDetailsController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { user: { userId }, params: { postId } } = req;

    const ownedPost = await Post.findOne({ creator: userId, _id: postId });
    if (!ownedPost) {
        throw new BadRequestError(`post with id ${postId} not found`);
    }
    res.status(StatusCodes.OK).json(
        {
            responseMessage: "Post Record Fetched successfully",
            post: ownedPost
        }
    );
}
const postListController = async (req, res) => {

    const { user: { userId } } = req;

    const posts = await Post.find({ creator: userId });
    res.status(StatusCodes.OK).json(
        {
            responseMessage: "Posts Record Fetched successfully",
            posts
        }
    );
}


module.exports = {
    createPostController,
    editPostController,
    deletePostController,
    postDetailsController,
    postListController
}