const fs = require('fs');

// delete file
const deleteFile = () => {
    fs.unlink(filePath, (err) => {
        throw err
    })
}

// file url clearner
const fileUrlClear = (filePath) => {
    return filePath.replace(/\\/g, '/');
}
module.exports = {
    deleteFile,
    fileUrlClear
}
