const express = require('express');
const router = express.Router();
const {
	register,
	login,
	forgotPassword,
	resetPassword
} = require('../controllers/authControllers');
const { authRoute } = require('./routeStrings');

// register
router.post(authRoute.register, register);

//login
router.post(authRoute.login, login);

//forgotpassword
router.post(authRoute.forgotPassword, forgotPassword);

//resetpassword
router.put(authRoute.resetPassword, resetPassword);

module.exports = router;
