// Express and Validation
const router = require("express").Router();
const { check, validationResult } = require("express-validator");
// JWT Authentication
const passport = require('passport');
require('../passport');
// Mongoose Models
const Models = require('../models/models.js');
const Users = Models.User;
// Require upload middleware
const upload = require('../libs/upload');

const singleUpload = upload.single('avatar');

router.post('/:Username/upload', (req, res) => {
  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({
        success: false,
        error: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        }
      });
    } else {
      res.send({
        message: 'Uploaded!'
      });
      let update = { ProfilePicture: req.file.location };
      Users.findOneAndUpdate(req.params.Username, update, { new: true })
        .then((user) => res.status(200).json({ success: true, user: user }))
        .catch((err) => {
          res.status(500).json({ success: false, error: err })
        });
    }
  });
});

module.exports = router;