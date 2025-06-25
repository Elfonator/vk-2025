const fs = require('fs');
const path = require('path');

// Read all file names from a directory
function getFileList(dir) {
    try {
        return fs.readdirSync(dir).filter(file => fs.lstatSync(path.join(dir, file)).isFile());
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
}

// Multer file filter to allow only specific types
function fileFilter(allowedTypes) {
    return (_req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };
}

module.exports = {
    getFileList,
    fileFilter,
};
