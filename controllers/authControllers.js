const User = require('../models/User');

const { sendPasswordResetEmail } = require('../util/sendEmail');
const StatusResponse = require('../util/statusResponse');

const register = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const newUser = new User({ username, email, password });
		await newUser.save();

		const user = await User.login(email, password);
		const payload = {
			id: user._id,
			token: user.token
		};

		return StatusResponse(
			res,
			201,
			'Your account has been created successfully',
			payload
		);
	} catch (error) {
		if (error.errors) {
			const errors = Object.keys(error.errors);
			const messages = errors.map(e => {
				return error.errors[e].message;
			});
			return StatusResponse(res, 400, messages);
		}

		if (error.code === 11000) {
			const usernameError = error.errmsg.match(/username/);
			const emailError = error.errmsg.match(/email/);

			if (usernameError) {
				return StatusResponse(
					res,
					400,
					'That username is taken, please try another one.'
				);
			}

			if (emailError) {
				return StatusResponse(
					res,
					400,
					'A user exists with that email, please try another one.'
				);
			}
		}
		return StatusResponse(res, 500);
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.login(email, password);

		if (!user) {
			return StatusResponse(res, 401);
		}

		const payload = {
			id: user._id,
			token: user.token
		};

		return StatusResponse(res, 200, 'Login successful', payload);
	} catch (error) {
		console.log(error);
		return StatusResponse(res, 500);
	}
};

const forgotPassword = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return StatusResponse(
				res,
				404,
				'An error occurred while trying to complete this request.'
			);
		}

		await sendPasswordResetEmail('bcorey85@gmail.com', 12345);
		return StatusResponse(res, 200, 'Password reset request complete.');
	} catch (error) {
		console.log(error);
		return StatusResponse(res, 500);
	}
};

const resetPassword = (req, res) => {};

module.exports = {
	register,
	login,
	forgotPassword,
	resetPassword
};
