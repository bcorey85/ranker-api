const request = require('supertest');
const { app } = require('../../app');
const User = require('../../models/User');
const {
	authErrorMessage,
	authSuccessMessage,
	genericErrorMessage
} = require('../responseStrings');
const { authRoute } = require('../../routes/routeStrings');
const { sendPasswordResetEmail } = require('../../util/sendEmail');

describe('User Register', () => {
	it('creates a new user if valid email and password provided', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const res = await request(app)
			.post(authRoute.register)
			.send(user)
			.expect(201);

		expect(res.body.message).toEqual(authSuccessMessage.accountCreated);
		expect(res.body.payload).toHaveProperty('id');
		expect(res.body.payload).toHaveProperty('token');
	});

	it('throws error if invalid email', async () => {
		const user = {
			username: 'test',
			email: 'testgmail.com',
			password: '123456'
		};

		const res = await request(app)
			.post(authRoute.register)
			.send(user)
			.expect(400);

		expect(res.body.message[0]).toEqual(authErrorMessage.invalidEmail);
	});

	it('throws error if invalid password', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: ''
		};

		const res = await request(app)
			.post(authRoute.register)
			.send(user)
			.expect(400);

		expect(res.body.message[0]).toEqual(authErrorMessage.invalidPassword);
	});

	it('throws error if username in use', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		await newUser.save();

		const user2 = {
			username: 'test',
			email: 'test2@gmail.com',
			password: '123456'
		};

		const res = await request(app)
			.post(authRoute.register)
			.send(user2)
			.expect(400);

		expect(res.body.message).toEqual(authErrorMessage.usernameInUse);
	});

	it('throws error if email in use', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		await newUser.save();

		const user2 = {
			username: 'test2',
			email: 'test@gmail.com',
			password: '123456'
		};

		const res = await request(app)
			.post(authRoute.register)
			.send(user2)
			.expect(400);

		expect(res.body.message).toEqual(authErrorMessage.emailInUse);
	});
});

describe('Login', () => {
	it('logs in a user if valid email and password provided', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		await newUser.save();

		const res = await request(app)
			.post(authRoute.login)
			.send(user)
			.expect(200);

		expect(res.body.message).toEqual(authSuccessMessage.loginSuccess);
	});

	it('throws error if missing email', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		await newUser.save();

		const loginRequest = {
			email: '',
			password: '123456'
		};

		const res = await request(app)
			.post(authRoute.login)
			.send(loginRequest)
			.expect(400);

		expect(res.body.message).toEqual(
			genericErrorMessage.invalidCredentials
		);
	});

	it('throws error if missing password', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		await newUser.save();

		const loginRequest = {
			email: 'test@gmail.com',
			password: ''
		};

		const res = await request(app)
			.post(authRoute.login)
			.send(loginRequest)
			.expect(400);

		expect(res.body.message).toEqual(
			genericErrorMessage.invalidCredentials
		);
	});

	it('throws error if user not found', async () => {
		const loginRequest = {
			email: 'test@gmail.com',
			password: '123456'
		};

		const res = await request(app)
			.post(authRoute.login)
			.send(loginRequest)
			.expect(401);

		expect(res.body.message).toEqual(
			genericErrorMessage.invalidCredentials
		);
	});
});

describe('Forgot Password', () => {
	it('sends email if successful request is made', async () => {
		const user = {
			username: 'test',
			email: 'bcorey85@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		await newUser.save();

		const resetRequest = {
			email: 'bcorey85@gmail.com'
		};

		const res = await request(app)
			.post(authRoute.forgotPassword)
			.send(resetRequest)
			.expect(200);

		expect(res.body.message).toEqual(
			authSuccessMessage.passwordRequestSuccess
		);
		expect(sendPasswordResetEmail).toHaveBeenCalled();
		expect(sendPasswordResetEmail.mock.calls[0][0]).toEqual(
			resetRequest.email
		);
	});

	it('throws error if user not found', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		await newUser.save();

		const resetRequest = {
			email: 'test2@gmail.com'
		};

		const res = await request(app)
			.post(authRoute.forgotPassword)
			.send(resetRequest)
			.expect(404);

		expect(res.body.message).toEqual(genericErrorMessage.notFound);
	});
});

describe('Reset Password', () => {
	it('resets password if token and valid password provided', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		newUser.passwordResetToken = newUser.generateResetPasswordToken();
		await newUser.save();

		const newPasswordRequest = {
			password: '234567',
			confirmPassword: '234567'
		};

		const res = await request(app)
			.put(`${authRoute.resetPasswordRoot}/${newUser.passwordResetToken}`)
			.send(newPasswordRequest)
			.expect(200);

		expect(res.body.message).toEqual(
			authSuccessMessage.passwordResetComplete
		);

		const updatedUser = await User.findOne({ email: user.email });

		const loginSuccess = await User.login(
			updatedUser.email,
			newPasswordRequest.password
		);

		expect(loginSuccess._id).toEqual(updatedUser._id);
	});

	it('throws error if user not found', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		await newUser.save();

		const passwordRequest = {
			password: '123456',
			confirmPassword: '123456'
		};

		const res = await request(app)
			.put(`${authRoute.resetPasswordRoot}/123456`)
			.send(passwordRequest)
			.expect(404);

		expect(res.body.message).toEqual(genericErrorMessage.notFound);
	});

	it('throws error if passwords do no match', async () => {
		const passwordRequest = {
			password: '123456',
			confirmPassword: '1234567'
		};

		const res = await request(app)
			.put(`${authRoute.resetPasswordRoot}/123546`)
			.send(passwordRequest)
			.expect(400);

		expect(res.body.message).toEqual(authErrorMessage.passwordNotMatch);
	});
});
