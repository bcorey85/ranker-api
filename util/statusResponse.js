const StatusResponse = (res, code, payload) => {
	let response;
	if (code === 401) {
		response = {
			success: false,
			payload: 'Please check your login credentials.'
		};
	} else if (code === 403) {
		response = {
			success: false,
			payload: 'You are not authorized to access this resource.'
		};
	} else if (code === 500) {
		response = {
			success: false,
			payload: 'An unknown server error occured. Please try again later.'
		};
	} else if (code.toString()[0] === '2') {
		response = {
			success: true,
			payload
		};
	} else if (code.toString()[0] === '4') {
		response = {
			success: false,
			payload
		};
	} else {
		response = {
			success: null,
			payload
		};
	}

	return res.status(code).send(response);
};

module.exports = StatusResponse;
