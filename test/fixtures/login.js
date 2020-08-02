const User = require('../../models/User');

const login = async () => {
	const credentials = {
		username: 'test',
		email: 'test@gmail.com',
		password: '123456'
	};
	const newUser = await new User(credentials);
	await newUser.save();

	const token = await newUser.generateAuthToken();

	return {
		userId: newUser._id,
		token
	};
};

module.exports = {
	login
};
