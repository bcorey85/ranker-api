const User = require('../models/User');
const crypto = require('crypto');

const { sendPasswordResetEmail } = require('../util/sendEmail');
const StatusResponse = require('../util/statusResponse');
const {
	authErrorMessage,
	authSuccessMessage,
	genericErrorMessage
} = require('./responseStrings');

const register = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const existingEmail = await User.findOne({ email });
		const existingUsername = await User.findOne({ username });
		if (existingEmail) {
			return StatusResponse(res, 400, authErrorMessage.emailInUse);
		}
		if (existingUsername) {
			return StatusResponse(res, 400, authErrorMessage.usernameInUse);
		}
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
			authSuccessMessage.accountCreated,
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

		return StatusResponse(res, 500);
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return StatusResponse(res, 400, genericErrorMessage.invalidCredentials);
	}

	try {
		const user = await User.login(email, password);

		if (!user) {
			return StatusResponse(res, 401);
		}

		const payload = {
			id: user._id,
			token: user.token
		};

		return StatusResponse(
			res,
			200,
			authSuccessMessage.loginSuccess,
			payload
		);
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
			return StatusResponse(res, 404, genericErrorMessage.notFound);
		}
		const resetToken = user.generateResetPasswordToken();
		await user.save();
		const resetLink = `${process.env
			.FRONTEND_URL}/resetpassword/${resetToken}`;

		await sendPasswordResetEmail(user.email, resetLink);
		return StatusResponse(
			res,
			200,
			authSuccessMessage.passwordRequestSuccess
		);
	} catch (error) {
		console.log(error);
		return StatusResponse(res, 500);
	}
};

const resetPassword = async (req, res) => {
	const { password, confirmPassword } = req.body;
	const { resetToken } = req.params;

	if (password !== confirmPassword) {
		return StatusResponse(res, 400, authErrorMessage.passwordNotMatch);
	}

	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	try {
		// Find user with non-expired token
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() }
		});

		if (!user) {
			return StatusResponse(res, 404, genericErrorMessage.notFound);
		}

		user.password = password;
		user.resetPasswordToken = null;
		user.resetPasswordExpire = null;
		await user.save();

		const response = await User.login(user.email, password);

		const payload = {
			id: response._id,
			token: response.token
		};

		return StatusResponse(
			res,
			200,
			authSuccessMessage.passwordResetComplete,
			payload
		);
	} catch (error) {
		console.log(error);
		return StatusResponse(res, 500);
	}
};

module.exports = {
	register,
	login,
	forgotPassword,
	resetPassword
};
