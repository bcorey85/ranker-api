const RankForm = require('../models/RankForm');
const User = require('../models/User');
const StatusResponse = require('../util/statusResponse');

const {
	authErrorMessage,
	authSuccessMessage,
	genericErrorMessage
} = require('./responseStrings');

const getUserById = async (req, res) => {
	const userId = req.params.userId;
	try {
		const user = await User.findOne({ _id: userId }).populate({
			path: 'rankForms',
			model: 'RankForm'
		});

		if (!user) {
			return StatusResponse(res, 404, genericErrorMessage.notFound);
		}

		const categories = [
			...new Set(user.rankForms.map(form => form.category))
		];

		const response = {
			user,
			categories
		};

		return StatusResponse(res, 200, 'User data', response);
	} catch (error) {
		return StatusResponse(res, 500);
	}
};

const updateUser = async (req, res) => {
	const update = req.body.inputState;
	const userId = req.params.userId;

	try {
		const user = await User.findOne({ _id: userId });

		if (!user) {
			return StatusResponse(res, 404, genericErrorMessage.notFound);
		}

		if (update.password && update.password.length < 6) {
			return StatusResponse(res, 400, authErrorMessage.invalidPassword);
		}

		const existingEmail = await User.findOne({ email: update.email });

		if (existingEmail) {
			return StatusResponse(res, 400, authErrorMessage.emailInUse);
		}

		if (update.password) {
			user.password = update.password;
		}

		if (update.email) {
			user.email = update.email;
		}

		await user.save();

		return StatusResponse(
			res,
			200,
			authSuccessMessage.userUpdateSuccess,
			user
		);
	} catch (error) {
		if (error.errors) {
			const errors = Object.keys(error.errors);
			const messages = errors.map(e => {
				return error.errors[e].message;
			});
			return StatusResponse(res, 400, messages);
		}
		console.error(error);
		return StatusResponse(res, 500);
	}
};

const deleteUser = async (req, res) => {
	const userId = req.params.userId;

	try {
		const user = await User.findOne({ _id: userId });

		if (!user) {
			return StatusResponse(res, 404, genericErrorMessage.notFound);
		}

		await RankForm.deleteMany({ _id: { $in: user.rankForms } });
		await user.deleteOne();
		return StatusResponse(res, 200, authSuccessMessage.userDeleteSuccess);
	} catch (error) {
		return StatusResponse(res, 500);
	}
};

module.exports = {
	getUserById,
	updateUser,
	deleteUser
};
