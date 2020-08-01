const authErrorMessage = {
	invalidUsername: 'Please enter a username',
	invalidEmail: 'Please enter a valid email.',
	invalidPassword: 'Please enter a password with at least 6 characters.',
	usernameInUse: 'That username is taken, please try another one.',
	emailInUse: 'A user exists with that email, please try another one.',
	invalidPasswordResetRequest:
		'Invalid request. Please request a new password reset email.',
	passwordNotMatch: 'Passwords do not match.'
};

module.exports = { authErrorMessage };
