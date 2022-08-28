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

router.post('/:Username/upload', (req, res) => {

  const params = {
    Bucket: "tethermedia",
    Key: req.params.Username,
    Body: req.body.Image
  };

  s3Client.send(
    new PutObjectCommand(params)
  )
    .then((res) => {
      console.log('successfully uploaded!');
    })
    .catch((err) => {
      console.error('Error: ' + err);
    });
})

module.exports = router;