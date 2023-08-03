const fs = require('fs');

const deleteFile = () => {
    fs.unlink(filePath, (err) => {
        throw err
    })
}

module.exports = {
    deleteFile
}