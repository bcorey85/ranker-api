const express = require('express');
const router = express.Router();
const {
	getUserById,
	updateUser,
	deleteUser
} = require('../controllers/userControllers');

const { userRoute } = require('./routeStrings');

const userAuth = require('../middleware/userAuth');

router
	.route(userRoute.userId)
	.get(userAuth, getUserById)
	.put(userAuth, updateUser)
	.delete(userAuth, deleteUser);

module.exports = router;
