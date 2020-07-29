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

		const categories = [
			...new Set(user.rankForms.map(form => form.category))
		];

		if (!user) {
			return StatusResponse(res, 404, 'Unable to locate user.');
		}
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
		console.log(user);

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

const deleteUser = async (req, res) => {
	const userId = req.params.userId;

	try {
		const user = await User.findOne({ _id: userId });

		await RankForm.deleteMany({ _id: { $in: user.rankForms } });
		await user.deleteOne();
		return StatusResponse(res, 200, 'User deleted successfully.');
	} catch (error) {
		return StatusResponse(res, 500);
	}
};

module.exports = {
	getUserById,
	updateUser,
	deleteUser
};
