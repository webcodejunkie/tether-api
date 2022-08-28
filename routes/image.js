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
const s3Client = require('../libs/s3Client');
const { PutObjectCommand } = require('@aws-sdk/client-s3')
// File Path
const fs = require('fs');

router.post('/:Username/upload', (req, res) => {

  const imagePath = req.files[0].path;
  const blob = fs.readFileSync(imagePath);

  const params = {
    Bucket: process.env.AWSBucket,
    Key: req.files[0].originalFilename,
    Body: blob
  };

  s3Client.send(
    new PutObjectCommand(params)
  )
    .then((result) => {
      res.status(201).send('Successfully uploaded!');
      const data = result;
      console.log(data);
    })
    .catch((err) => {
      console.error('Error: ' + err);
      res.status(500).send('Error:' + err);
    });
})

module.exports = router;