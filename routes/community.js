const router = require("express").Router();
const { check, validationResult } = require("express-validator");

// JWT Authentication
const passport = require('passport');
require('../passport');

// Mongoose Models
const Models = require('../models/models.js');

const Community = Models.Community;
const Users = Models.User;

// Router Test
router.get('/', (req, res) => {
  res.send('youre in the community route :)');
})

router.post('/create/:GameID/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Community.findOne({ Name: req.body.Name })
    .then((com) => {
      if (com) {
        return res.status(400).send(req.body.Name + ' not avalible, please choose a different name.')
      } else {
        Community
          .create({
            Name: req.body.Name,
            Desc: req.body.Desc,
            Admin: req.params.UserID
          })
          .then((com) => { res.status(201).json(com) })
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
})