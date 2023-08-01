const { StatusCodes } = require("http-status-codes");
const { validationResult } = require('express-validator');

// guides data
const tourGuides = {
    'POST': [
        {
            "title": "Create a Post",
            "description": "Unlock the potential of your user profile and showcase your professional services with a compelling promotional post."
        }
    ],

    'STORY': [
        {
            "title": "Create a Story",
            "description": "Transforming Homes, One Dream at a Time: Discover the Tale of Our Professional Service for Homeowners"
        }
    ],
    'PROFESSIONAL': [
        {
            "title": "Become a Professional",
            "description": "Transform into a professional assisting property owners in effectively selling their homes."
        },
        {
            "title": "Upgrade Plan",
            "description": "Enhance your user experience by upgrading to a premium plan, granting you access to a wide range of additional features and functionalities."
        },
        {
            "title": "FInd Professional",
            "description": "Discover a reliable professional who can assist you in the process of selling your home."
        }
    ],
    'PROPERTY': [
        {
            "title": "Create Property",
            "description": "Efficiently sell or rent your property while avoiding the burden of realtor fees"
        },
        {
            "title": "Find Property",
            "description": "Experience a smarter and more convenient approach to searching for homes and rentals"
        }
    ],
}

const tourGuideController = async (req, res) => {
    const { tourType } = req.body;
    const requestedGuide = tourGuides[tourType];

    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status and the error messages
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    res.status(StatusCodes.OK).json(
        {
            "responseCode": "200",
            "responseMessage": "200",
            "execTime": 52,
            "errors": null,
            "results": requestedGuide
        }
    )

}

module.exports = tourGuideController;