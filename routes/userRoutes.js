const express = require('express');
const router = express.Router();
const { getUserById, updateUser } = require('../controllers/userControllers');

router.route('/:userId').get(getUserById).put(updateUser);

module.exports = router;
