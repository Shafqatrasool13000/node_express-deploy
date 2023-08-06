const fs = require('fs');

// delete file
const deleteFile = () => {
    fs.unlink(filePath, (err) => {
        throw err
    })
}

// file url clearner
const fileUrlCleaner = (filePath) => {
    return filePath.replace(/\\/g, '/');
}

// check file type

const storageByFileType = (mimeType) => {
    const fileType = mimeType.includes('image');

    if (fileType) {
        return 'images';
    } else if (mimeType.includes('video')) {
        return 'videos';
    } else {
        return 'assets'; // Default storage type
    }
}

module.exports = {
    deleteFile,
    fileUrlCleaner,
    storageByFileType
}
