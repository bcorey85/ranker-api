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

const updateUser = (req, res) => {};

module.exports = {
	getUserById,
	updateUser
};
