const router = require("express").Router();
const { check, validationResult } = require("express-validator");

// JWT Authentication
const passport = require('passport');
require('../passport');

// Mongoose Models
const Models = require('../models/models.js');

const Community = Models.Community;
const Post = Models.Post;
const Users = Models.User;

// Router Test
router.get('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
  Community.find()
    .then((com) => {
      res.status(201).json(com);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error ' + error);
    });
});

router.post('/create/:UserID/:GameID/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Community.findOne({ Name: req.body.Name })
    .then((com) => {
      if (com) {
        return res.status(400).send(req.body.Name + ' not avalible, please choose a different name.')
      } else {
        Community
          .create({
            Name: req.body.Name,
            Desc: req.body.Desc,
            Admin: req.params.UserID,
            Game: req.params.GameID
          })
          .then((com) => {
            res.status(201).json(com);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

router.delete('/delete/:UserID/:GameID/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Community.findOneAndDelete({ Admin: req.params.UserID })
    .then((com) => {
      if (!com) {
        res.status(400).send(req.params.UserID + ' community not be found, try again.')
      } else {
        res.status(400).send(req.params.UserID + ' community has been deleted.')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

router.post('/:UserID/join/:CommunityID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Community.findOneAndUpdate({ _id: req.params.CommunityID }, {
    $push: { Members: req.params.UserID }, $inc: { MembersCount: 1 }
  }, { new: true },
    (error, updatedData) => {
      if (error) {
        console.error(error);
      } else {
        res.json(updatedData);
      }
    });
});

router.post('/:UserID/:GameID/', passport.authenticate('jwt', { session: false }), (req, res) => {
  let postObj = {
    from: req.params.UserID,
    content: req.body.content,
    postedDate: Date(),
    likes: 0,
    comments: [],
  }
  Community.findOneAndUpdate({ Admin: req.params.UserID }, {
    $push: { Posts: postObj }
  }, { new: true },
    (error, updatedData) => {
      if (error) {
        console.error(error);
      } else {
        res.json(updatedData);
      }
    });
});

module.exports = router;
