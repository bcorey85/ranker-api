const authErrorMessage = {
	invalidUsername: 'Please enter a username',
	invalidEmail: 'Please enter a valid email',
	invalidPassword: 'Please enter a password with at least 6 characters',
	usernameInUse: 'That username is taken, please try another one',
	emailInUse: 'A user exists with that email, please try another one',
	invalidPasswordResetRequest:
		'Invalid request. Please request a new password reset email',
	passwordNotMatch: 'Passwords do not match'
};

const authSuccessMessage = {
	accountCreated: 'Your account has been created successfully',
	loginSuccess: 'Login successful',
	passwordRequestSuccess: 'Password reset request complete',
	passwordResetComplete: 'Password change complete',
	userUpdateSuccess: 'User details updated successfully',
	userDeleteSuccess: 'User deleted successfully'
};

const formErrorMessage = {
	formMissingError: 'Please submit a form to save.',
	formDateMissing: 'Please add a date to your form',
	formTitleMissing: 'Please add a title to your form'
};

const formSuccessMessage = {
	formSaveSuccess: 'Form saved successfully.',
	formUpdateSuccess: 'Form updated successfully',
	formDeleteSuccess: 'Form deleted successfully'
};

const genericErrorMessage = {
	notFound: 'Unable to locate the requested information',
	invalidCredentials: 'Invalid login credentials',
	notAuthorized: 'You are not authorized to access this information',
	serverError: 'An unknown server error occurred. Please try again later.'
};

module.exports = {
	authErrorMessage,
	authSuccessMessage,
	formErrorMessage,
	formSuccessMessage,
	genericErrorMessage
};
