const router = require("express").Router();
const { check, validationResult } = require("express-validator");

// JWT Authentication
const passport = require('passport');
require('../passport');

// Mongoose Models
const Models = require('../models/models.js');
const Users = Models.User;
const Posts = Models.Post;

// Router Test
router.get('/', (req, res) => {
  res.send('youre in the user route :)');
})

/**
 * Register Method
 * @method Register
 * @param {string} Username - Username of the user required to sign up.
 * @param {string} Password - Hashed Password created for the user to sign up.
 * @param {string} Email - Email of the user required to sign up.
 * @param {date} Birthday - Birthday of the user required to sign up.
 * @param {string} Bio - Biography of the user.
 * @param {string} PlayerType - A string representing the user's play style.
 * @param {string} Region - The user's region.
 * @param {string} Country - The user's country.
 * @param {string} ProfilePicture - User's avatar.
 *
 * @return {object} returns the posted user that was created
 * @throws if Username, Password, Email, and Birthday aren't filled out.
 */
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

/**
 * Find All Players
 * @method FindPlayers
 * @summary - Request to find all players that have signed up and reside in the database for users.
 *
 */
router.get('/findplayers', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find({})
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error' + error);
    });
});

/**
 * Find User Method
 * @method GetUser
 * @param {string} Username - Username of the user that is to be searched.
 * @return {object} Returns information on the requested user.
 * @throws If the user isn't found.
 */

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

/**
 * @method EditProfile
 * @summary The users is able to change only the username, password, email or bio.
 * @param {string} Username - Edit the username of the user.
 * @param {string} Password - Edit the password of the user.
 * @param {string} Email - Edit the users email.
 * @param {string} Bio - Edit the biography of the user.
 * @return {object} returns the posted user that was created
 * @throws if Username, Password, Email, and Bio aren't filled out.
 */

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

/**
 * @method DeleteProfile
 * @summary If the current user is found, delete the object from the database
 * @param {string} Username - The username of the current user
 *
 * @return {status} Return status 200 that the profile has been deleted
 * @throws If user doesn't exist
 */

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

/**
 * @method FollowPlayer
 * @summary Follow a player that user wants to append to their friends list.
 * @param {string} Username - The username of the current user
 * @param {string} UserID - The userId of the recipient
 *
 * @return {object} Return the current user with the updated friends array
 * @throws If the request couldn't be resolved
 */

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

/**
 * @method FollowGame
 * @summary Follow a game that user wants to append to their favorites list.
 * @param {string} Username - The username of the current user
 * @param {string} GameID - The GameId of the game object
 *
 * @return {object} Return the current user with the updated favorites array
 * @throws If the request couldn't be resolved
 */

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

/**
 * @method UnfollowGame
 * @summary Unfollow a game that user wants to remove to their favorites list.
 * @param {string} Username - The username of the current user
 * @param {string} GameID - The gameId of the recipient
 *
 * @return {object} Retu rn the current user with the updated favorites array
 * @throws If the request couldn't be resolved
 */

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

/**
 * @method UnFollowPlayer
 * @summary UnFollow a player that user wants to remove from their friends list.
 * @param {string} Username - The username of the current user
 * @param {string} UserID - The userId of the recipient
 *
 * @return {object} Return the current user with the updated friends array
 * @throws If the request couldn't be resolved
 */

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
    .then((post) => {
      res.status(201).send('All posts have been sent!');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

module.exports = router;
