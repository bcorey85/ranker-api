const express = require('express');
const router = express.Router();
const {
	register,
	login,
	forgotPassword,
	resetPassword
} = require('../controllers/authControllers');

// register
router.post('/register', register);

//login
router.post('/login', login);

//forgotpassword
router.post('/forgotpassword', forgotPassword);

//resetpassword
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;
