const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadMiddleware = multer({ storage: storage });

const setupCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });
};

module.exports = { setupCloudinary, uploadMiddleware, cloudinary };
