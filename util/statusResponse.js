const { genericErrorMessage } = require('../controllers/responseStrings');

const StatusResponse = (res, code, message, payload) => {
	let response = {
		success: null,
		message,
		payload
	};
	if (code === 401) {
		response.success = false;
		response.message = message || genericErrorMessage.invalidCredentials;
	} else if (code === 403) {
		response.success = false;
		response.message = message || genericErrorMessage.notAuthorized;
	} else if (code === 500) {
		response.success = false;
		response.message = message || genericErrorMessage.serverError;
	} else if (code.toString()[0] === '2') {
		response.success = true;
	} else if (code.toString()[0] === '4') {
		response.success = false;
	}

	return res.status(code).send(response);
};

module.exports = StatusResponse;
