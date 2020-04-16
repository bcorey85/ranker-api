const express = require('express');
const router = express.Router();
const {
	createRankForm,
	getRankFormById,
	updateRankForm,
	deleteRankForm
} = require('../controllers/rankControllers');

const userAuth = require('../middleware/userAuth');

router.route('/').post(userAuth, createRankForm);

router
	.route('/:rankFormId')
	.get(userAuth, getRankFormById)
	.put(userAuth, updateRankForm)
	.delete(userAuth, deleteRankForm);

module.exports = router;
