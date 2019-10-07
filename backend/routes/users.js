const express = require('express'),
	router = express.Router(),
	jwt = require('jsonwebtoken'),
	jwtdecode = require('jwt-decode'),
	auth = require('../middleware/auth');

User = require('../models/UserSchema'),

	config = require('../config');


/* POST User register */
router.post('/register', (req, res) => {
	let newUser = new User();

	newUser.name = req.body.name;
	newUser.username = req.body.username;
	newUser.password = req.body.password;

	newUser.created_at = new Date();
	newUser.updated_at = new Date();

	newUser.save(function (err, saved) {
		if (err) throw err.errmsg;

		res.status(200).json({
			success: true,
			message: "Successfully registered",
		})
	})
});

/* POST User login */
router.post('/login', (req, res) => {
	User.findOne({
		username: req.body.username
	}, (error, user) => {
		if (error) res.status(500).json({
			success: false,
			message: "There is something wrong with the system. Please contact Administrator immediately",
			system_error: error
		});

		if (user) {
			user.comparePassword(req.body.password, (err, isMatch) => {
				console.log(err, req.body.password, isMatch, "isMatch")
				if (err) throw err;

				if (isMatch) {
					User.findByIdAndUpdate(user._id, { $set: { last_login: new Date() } }, (err, updated) => {
						if (err) throw err;

						var token = jwt.sign({
							id: user._id,
							name: user.name,
							username: user.username
						}, config.JWT_SECRET, { expiresIn: '1h' });

						res.cookie('token', token).sendStatus(200);
					});
				} else {
					res.status(401).json({
						success: false,
						message: "Invalid Username/Password",
						result: {}
					})
				}
			});
		} else {
			res.status(200).json({
				success: true,
				message: "No user found",
				result: {}
			})
		}


	});
});

/* GET Current user token */
router.get('/verify', auth.isAuthenticated, (req, res) => {
	res.sendStatus(200);
})

/* GET Current user profile */
router.get('/whoami', auth.isAuthenticated, (req, res) => {
	const token =
		req.body.token ||
		req.query.token ||
		req.headers['x-access-token'] ||
		req.cookies.token;

	if (token) {
		let data = jwtdecode(token);
		res.status(200).json({
			success: true,
			message: "Successfully get user name",
			result: data.name
		});
	} else {
		res.status(401).json({
			success: false,
			message: "You are not logged in",
			result: null
		})
	}
})

module.exports = router;