const router = require("express").Router();
const { check, validationResult } = require("express-validator");

// JWT Authentication
const passport = require('passport');
require('../passport');

// Mongoose Models
const Models = require('../models/models.js');

const Post = Models.Post;


router.post('/:Username', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.create({
      msg: req.body.msg,
      user: req.params.Username
    })
      .then((msg) => {
        res.status(201).json(msg)
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });


module.exports = router;