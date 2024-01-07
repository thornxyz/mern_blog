const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dtsaa1lyg',
    api_key: '586722291891852',
    api_secret: 'SDk87pXrxDKsrbIjijgNk6NsLMk'
});

module.exports = cloudinary;