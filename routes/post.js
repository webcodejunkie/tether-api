const router = require("express").Router();

const passport = require("passport");
require('../passport');

const Models = require("../models/models");
const Posts = Models.Post;

// Post A Message
router.post('/post/:UserID/', passport.authenticate('jwt', { session: false }), (req, res) => {
	Posts
		.create({
			'from.UserID': req.body.UserID,
			'from.Avatar': req.body.Avatar,
			'from.Username': req.body.Username,
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
	Posts.find({}).sort({ createdAt: -1 })
		.then((posts) => {
			res.status(201).json(posts);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// Get Users Posts
router.get('/:UserID/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
	Posts.find({ 'from.UserID ': req.params.UserID }).sort({ createdAt: -1 })
		.then((posts) => {
			res.status(201).json(posts);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
})

module.exports = router;