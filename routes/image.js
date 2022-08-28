// Express and Validation
const router = require("express").Router();
const { check, validationResult } = require("express-validator");
// JWT Authentication
const passport = require('passport');
require('../passport');
// Mongoose Models
const Models = require('../models/models.js');
const Images = Models.Image;
// AWS S3 Modules
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const REGION = "us-east-1";
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
  }
});
// Multer module to process Images
const multer = require('multer');
const multerS3 = require('multer-s3');
// File Path
const fs = require('fs');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSBucket,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
})

router.post('/:Username/upload', upload.single('avatar'), (req, res) => {
  res.send({
    message: 'Uploaded!',
    urls: req.files.map(function (file) {
      return { url: file.location, name: file.key, type: file.mimetype, size: file.size };
    })
  })
})

module.exports = router;