const router = require("express").Router();
const { check, validationResult } = require("express-validator");

// JWT Authentication
const passport = require('passport');
require('../passport');

const upload = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');

// Mongoose Models
const Models = require('../models/models.js');

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
            PlayerType: req.body.PlayerType
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
    img: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
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

// Add / Follow Player

router.post('/:Username/:UserID', passport.authenticate('jwt', { session: false }), (req, res) => {
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

// Unfollow - Unfriend Player

router.delete('/:Username/:UserID', passport.authenticate('jwt', { session: false }), (req, res) => {
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


router.put('/message/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { Messages: req.body.Messages }
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