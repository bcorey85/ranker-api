const RankForm = require('../models/RankForm');
const User = require('../models/User');
const StatusResponse = require('../util/statusResponse');

const getUserById = async (req, res) => {
	const userId = req.params.userId;
	try {
		const user = await User.findOne({ _id: userId }).populate({
			path: 'rankForms',
			model: 'RankForm'
		});

		if (!user) {
			return StatusResponse(res, 404, 'Unable to locate user.');
		}

		return StatusResponse(res, 200, 'User data', user);
	} catch (error) {
		return StatusResponse(res, 500);
	}
};

const updateUser = async (req, res) => {
	const update = req.body.inputState;
	const userId = req.params.userId;

	try {
		const user = await User.findOne({ _id: userId });

		if (update.password && update.password.length < 6) {
			return StatusResponse(
				res,
				400,
				'Password must be at least 6 characters.'
			);
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
			'User details updated successfully.',
			user
		);
	} catch (error) {
		if (error.code === 11000) {
			return StatusResponse(
				res,
				400,
				'A user exists with that email, please try another one.'
			);
		}

		return StatusResponse(res, 500);
	}
};

module.exports = {
	getUserById,
	updateUser
};
