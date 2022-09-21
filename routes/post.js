const router = require("express").Router();

const passport = require("passport");
require('../passport');

const Models = require("../models/models");
const Posts = Models.Post;

// Post A Message
router.post('/post/:UserID/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Posts
    .create({
      from: req.body.from,
      content: req.body.content,
    })
    .then((post) => {
      console.log(post);
      res.status(201).json(post);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get Feed Of All Posts
router.get('/feed', passport.authenticate('jwt', { session: false }), (req, res) => {
    Posts.find({})
      .then((posts) => {
        res.status(201).json(posts);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  module.exports = router;