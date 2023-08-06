const multer = require('multer');
const { appData } = require('./appData');
const { storageByFileType } = require('./file');

//  storage configuration
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, storageByFileType(file.mimetype))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});

//  mimetype filter
const fileFilter = (req, file, cb) => {
    if (appData.multiPartLimits.imagesAllowedFormatList.includes(file.mimetype) || file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(new Error('file type is not supported'), false)
    }
}

const multerMiddleware = multer({ storage: fileStorage, fileFilter });

module.exports = {
    multerMiddleware,
}
