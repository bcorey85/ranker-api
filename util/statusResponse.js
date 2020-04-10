const StatusResponse = (res, code, message, payload) => {
	let response = {
		success: null,
		message,
		payload
	};
	if (code === 401) {
		response.success = false;
		response.message = 'Please check your login credentials.' || message;
	} else if (code === 403) {
		response.success = false;
		response.message =
			'You are not authorized to access this resource.' || message;
	} else if (code === 500) {
		response.success = false;
		response.message =
			'An unknown server error occurred. Please try again later.' ||
			message;
	} else if (code.toString()[0] === '2') {
		response.success = true;
	} else if (code.toString()[0] === '4') {
		response.success = false;
	}

	return res.status(code).send(response);
};

module.exports = StatusResponse;
