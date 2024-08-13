const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

function fileFilter (req, file, cb) {
    if (Object.keys(MIME_TYPES).includes(file.mimetype)) {
        return cb(null, true)
    }
    cb(new Error('Fichier non accepté !', {cause: "Invalid Data"}))
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split(".").slice(0,-1).join('') + "-raw";
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name +'.' + extension);
    }
});

module.exports = multer({
    storage,
    fileFilter,
}).single('image');