const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const async = require('async');

// JWT Authentication
const passport = require('passport');
require('../passport');

const upload = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');

// Mongoose Models
const Models = require('../models/models.js');
const { callbackify } = require("util");

const Post = Models.Post;
const ImageModel = Models.Image;
const Users = Models.User;

// Router Test
router.get('/', (req, res) => {
  res.send('youre in the user route :)');
})

// REGISTER
router.post('/register', [
  check('Username', 'Username is required').not().isEmpty(),
  check('Username', 'Username is required').isLength({ max: 10 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Password', 'Password must be more then 8 characters').isLength({ min: 8 }),
  check('Email', 'Email does not appear to be valid').isEmail(),
  check('Bio', 'Max characters - 250').isLength({ max: 250 })
], (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Check to see if the User entered already exists
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
            ProfilePicture: req.body.ProfilePicture,
            Bio: req.body.Bio,
            PlayerType: req.body.PlayerType,
            Country: req.body.Country,
            Region: req.body.Region,
          })
          .then((user) => { res.status(201).json(user) })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error:' + err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });

});

// Upload A Photo
router.post('/upload', upload.single('image'), (req, res) => {
  let obj = {
    name: req.body.name,
    desc: req.body.desc,
    image: {
      data: fs.readFileSync(path.join('/uploads/' + req.file.path)),
      contentType: 'image/png'
    }
  }

  ImageModel
    .create(obj, (error, item) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect('/');
      }
    })
});

// Find Players - Get All Users
router.get('/findplayers', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error' + error);
    });
});

// Find Profile

router.get('/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error' + error);
    });
});

// Edit Profile

router.put('/:Username', passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username is required').not().isEmpty(),
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Password', 'Password must be more then 8 characters').isLength({ min: 8 }),
    check('Email', 'Email does not appear to be valid').isEmail(),
    check('Bio', 'Max characters - 250').isLength({ max: 250 })
  ], (req, res) => {
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
        Bio: req.body.Bio
      }
    }, { new: true },
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error: ' + error);
        } else {
          res.json(updatedUser);
        }
      })

  });

// Delete Profile

router.delete('/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' could not be found, please try again.');
      } else {
        res.status(200).send(req.params.Username + ' profile has been deleted, sorry to see you go.')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Friend-Request Logic

router.post('/:Username/:UserID', passport.authenticate('jwt', { session: false }), (req, res) => {
  async.parallel([
    function (callback) {
      if (req.body.receiverName) {
        Users.updateMany({
          'Username': req.body.receiverName,
          'Requests.UserId': { $ne: req.user._id },
          'Friends.FriendId': { $ne: req.user._id }
        }, {
          $push: {
            Requests: {
              UserId: req.user._id,
              Username: req.user.Username
            },
            $inc: { TotalRequest: 1 }
          }
        }, { new: true },
          (error, count) => {
            console.log(error);
            callback(error, count);
          });
      }
    },

    function (callback) {
      if (req.body.receiverName) {
        Users.updateMany({
          'Username': req.body.Username,
          'SentRequest.Username': { $ne: req.body.receiverName },
        }, {
          $push: {
            SentRequest: {
              Username: req.user.Username,
              'SentRequest.Username': { $ne: req.body.receiverName }
            }
          }
        },
          (error, count) => {
            console.log(error);
            callback(error, count);
          })
      }
    }
  ]),
    (err, results) => {
      res.redirect('/:Username/:UserID');
    }

  async.parallel([
    // This function is updated for the receiver of the friend reqyest when it is accepted
    function (callback) {
      if (req.body.senderId) {
        Users.updateMany({
          '_id': req.user._id,
          'Friends.FriendId': { $ne: req.body.senderId }
        }, {
          $push: {
            Friends: {
              FriendId: req.body.senderId,
              FriendName: req.body.senderName
            }
          },
          $pull: {
            Requests: {
              UserId: req.body.senderId,
              Username: req.body.senderName
            }
          },
          $inc: { TotalRequest: -1 }
        }, (error, count) => {
          callback(error, count);
        });
      }
    },

    // This function is updated for the sender of the the friend request when it is accepted by the receiver
    function (callback) {
      if (req.body.senderId) {
        Users.updateMany({
          '_id': req.body.senderId,
          'Friends.FriendId': { $ne: req.user._id }
        }, {
          $push: {
            Friends: {
              FriendId: req.user._id,
              FriendName: req.user.Username
            }
          },
          $pull: {
            Requests: {
              Username: req.user.Username
            }
          },
          $inc: { TotalRequest: -1 }
        }, (error, count) => {
          callback(error, count);
        });
      }
    },

    function (callback) {
      if (req.body.user_id) {
        Users.updateMany({
          '_id': req.user._id,
          'Requests.UserId': { $ne: req.body.user_id }
        }, {
          $pull: {
            Requests: {
              UserId: req.body.user_id
            }
          },
          $inc: { TotalRequest: -1 }
        }, (error, count) => {
          callback(error, count);
        });
      }
    },

    function (callback) {
      if (req.body.userId) {
        Users.updateMany({
          '_id': req.body.user_id,
          'SentRequest.Username': { $ne: req.user.Username }
        }, {
          $pull: {
            Requests: {
              Username: req.user.Username
            }
          }
        }, (error, count) => {
          callback(error, count);
        });
      }
    }
  ], (err, results) => {
    res.redirect('/:Username/:UserID')
  })
});

// Add / Follow Player

router.post('/:Username/user/:UserID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { Friends: req.params.UserID }
  }, { new: true },
    (error, updatedUser) => {
      if (error) {
        console.error(error);
      } else {
        res.json(updatedUser);
      }
    });
});

// Add / Follow a game

router.post('/:Username/game/:GameID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { Favorites: req.params.GameID }
  }, { new: true },
    (error, updatedUser) => {
      if (error) {
        console.error(error);
      } else {
        res.json(updatedUser);
      }
    });
});

// Remove a following of a game

router.delete('/:Username/game/:GameID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { Favorites: req.params.GameID }
  }, { new: true },
    (error, updatedUser) => {
      if (error) {
        console.error(error);
      } else {
        res.json(updatedUser);
      }
    });
});

// Unfollow - Unfriend Player

router.delete('/:Username/user/:UserID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { Friends: req.params.UserID }
  }, { new: true },
    (error, updatedUser) => {
      if (error) {
        console.error(error);
      } else {
        res.json(updatedUser);
      }
    });
});


router.put('/message/:Username/:UserID', passport.authenticate('jwt', { session: false }), (req, res) => {

  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: {
      Messages: {
        msg: {
          text: req.body.text,
          from: req.params.UserID,
          sent: Date(),
        }
      }
    }
  }, { new: true },
    (error, updatedUser) => {
      if (error) {
        console.error(error);
      } else {
        res.json(updatedUser);
      }
    });
});

module.exports = router;
