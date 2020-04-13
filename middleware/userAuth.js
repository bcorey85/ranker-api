const jwt = require('jsonwebtoken');
const StatusResponse = require('../util/statusResponse');
const User = require('../models/User');

const userAuth = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			return StatusResponse(res, 401);
		}

		const token = req.headers.authorization.replace('Bearer ', '');

		if (!token) {
			return StatusResponse(res, 401);
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findOne({ _id: decoded.id });

		if (!user) {
			return StatusResponse(res, 404, 'Invalid credentials');
		}

		req.token = token;
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		if (error.message === 'jwt malformed') {
			return StatusResponse(res, 403, 'Please log in again');
		}

		if (error.message === 'jwt expired') {
			return StatusResponse(res, 403, 'Please log in again.');
		}
	}
};

module.exports = userAuth;
