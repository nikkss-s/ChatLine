const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const dotenv = require("dotenv").config();

const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

let clStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chatfiles",
    public_id: (req, file) => {
      file.fieldname + "-" + Date.now();
    },
  },
});

let multerObj = multer({ storage: clStorage });

module.exports = multerObj;