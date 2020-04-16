const RankForm = require('../models/RankForm');
const User = require('../models/User');
const StatusResponse = require('../util/statusResponse');

const createRankForm = async (req, res) => {
	const newForm = req.body;

	try {
		if (!newForm.items || !newForm.items.length > 0) {
			return StatusResponse(res, 400, 'Please submit a form to save.');
		}

		const form = await new RankForm(newForm);

		await form.save();

		const user = req.user;

		user.rankForms.push(form);
		await user.save();

		return StatusResponse(res, 201, 'Form saved successfully.');
	} catch (error) {
		console.log(error);

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

const getRankFormById = (req, res) => {};

const updateRankForm = async (req, res) => {
	const formUpdate = req.body;
	const { rankFormId } = req.params;

	try {
		const form = await RankForm.findOneAndUpdate(
			{ _id: rankFormId },
			formUpdate
		);

		return StatusResponse(res, 200, 'Form updated successfully.');
	} catch (error) {
		return StatusResponse(res, 500);
	}
};

const deleteRankForm = async (req, res) => {
	const { rankFormId } = req.params;

	try {
		const form = await RankForm.findOne({ _id: rankFormId });
		const user = await User.findOne({ _id: req.user.id });
		user.rankForms = user.rankForms.filter(
			formId => formId.toString() !== rankFormId.toString()
		);
		await user.save();
		await form.remove();

		return StatusResponse(res, 200, 'Form deleted successfully');
	} catch (error) {
		return StatusResponse(res, 500);
	}
};

module.exports = {
	createRankForm,
	getRankFormById,
	updateRankForm,
	deleteRankForm
};
