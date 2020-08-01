const express = require('express');
const router = express.Router();
const {
	createRankForm,
	getRankFormById,
	updateRankForm,
	deleteRankForm
} = require('../controllers/rankControllers');

const { rankRoute } = require('./routeStrings');

const userAuth = require('../middleware/userAuth');

router.route(rankRoute.root).post(userAuth, createRankForm);

router
	.route(rankRoute.rankFormId)
	.get(userAuth, getRankFormById)
	.put(userAuth, updateRankForm)
	.delete(userAuth, deleteRankForm);

module.exports = router;
