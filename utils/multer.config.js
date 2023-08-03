const multer = require('multer');
const { appData } = require('./appData');

// image storage configuration
const imagesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

// images mimetype filters
const imageFilesFilter = (req, file, cb) => {
    if (appData.multiPartLimits.imagesAllowedFormatList.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Image is Required'), false)
    }
}

// video storage configuration
const videosStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'videos')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

// video mimetype filters
const videoFilesFilter = (req, file, cb) => {
    if (appData.multiPartLimits.imagesAllowedFormatList.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Video is Required'), false)
    }
}

const multerImageMiddleware = multer({ storage: imagesStorage, fileFilter: imageFilesFilter });
const multerVideoMiddleware = multer({ storage: videosStorage, fileFilter: videoFilesFilter });

module.exports = {
    multerImageMiddleware,
    multerVideoMiddleware
}
