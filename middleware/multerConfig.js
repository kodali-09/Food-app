var multer = require('multer');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name:process.env.cloudname,
    api_key:process.env.apikey,
    api_secret:process.env.apisecret
});
const cloudinaryStorage=require("multer-storage-cloudinary");
//multer.diskStorage() creates a storage space for storing files. 
var storageForCloudinary = cloudinaryStorage({
    cloudinary:cloudinary,
    folder:'Images',
    // allowedFormats:['jpg','png','jpeg'],
    filename: function (req, file, cb) {
        cb(null,file.fieldname +'-'+Date.now())
    }
});

const upload = multer({
    storage: storageForCloudinary,
})

module.exports = upload;
