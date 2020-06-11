const express = require('express');
const router = express.Router();
const {
	getUserById,
	updateUser,
	deleteUser
} = require('../controllers/userControllers');

const userAuth = require('../middleware/userAuth');

router
	.route('/:userId')
	.get(userAuth, getUserById)
	.put(userAuth, updateUser)
	.delete(userAuth, deleteUser);

module.exports = router;
