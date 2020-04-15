const RankForm = require('../models/RankForm');
const User = require('../models/User');
const StatusResponse = require('../util/statusResponse');

const createRankForm = async (req, res) => {
	const newForm = req.body.form;

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

const updateRankForm = (req, res) => {};

const deleteRankForm = (req, res) => {};

module.exports = {
	createRankForm,
	getRankFormById,
	updateRankForm,
	deleteRankForm
};
