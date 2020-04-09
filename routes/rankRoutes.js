const express = require('express');
const router = express.Router();
const {
	createRankForm,
	getRankFormById,
	updateRankForm,
	deleteRankForm
} = require('../controllers/rankControllers');

router.route('/').post(createRankForm);

router
	.route('/:rankFormId')
	.get(getRankFormById)
	.put(updateRankForm)
	.delete(deleteRankForm);

module.exports = router;
