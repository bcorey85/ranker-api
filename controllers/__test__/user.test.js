const request = require('supertest');
const { app } = require('../../app');
const User = require('../../models/User');
const { authErrorMessage } = require('../responseStrings');
const { userRoute } = require('../../routes/routeStrings');
const { login } = require('../../test/fixtures/login');

describe('Get User by Id', () => {
	it.todo('returns user info if successful');
	it.todo('throws error if user not found');
});

describe('Update User', () => {
	it.todo('updates user if successful');

	it('throws error if invalid email', async () => {
		const { userId, token } = await login();

		const userUpdate = {
			email: 'modifiedgmail.com',
			password: '123456'
		};

		const res = await request(app)
			.put(`${userRoute.userIdRoot}/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ inputState: userUpdate })
			.expect(400);

		expect(res.body.message[0]).toEqual(authErrorMessage.invalidEmail);

		const originalUser = await User.findOne({ _id: userId });
		expect(originalUser.email).not.toEqual('modifiedgmail.com');
	});

	it('throws error if invalid password', async () => {
		const { userId, token } = await login();

		const userUpdate = {
			email: 'test@gmail.com',
			password: '12'
		};

		const res = await request(app)
			.put(`${userRoute.userIdRoot}/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ inputState: userUpdate })
			.expect(400);

		expect(res.body.message).toEqual(authErrorMessage.invalidPassword);

		const originalUser = await User.findOne({ _id: userId });
		const loginSuccess = await User.login(
			originalUser.email,
			userUpdate.password
		);

		expect(loginSuccess).toBe(undefined);
	});

	it('throws error if email in use', async () => {
		const user = {
			username: 'test2',
			email: 'previous@gmail.com',
			password: '123456'
		};

		const newUser = new User(user);
		await newUser.save();

		const { userId, token } = await login();

		const userUpdate = {
			email: 'previous@gmail.com',
			password: '123456'
		};

		const res = await request(app)
			.put(`${userRoute.userIdRoot}/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ inputState: userUpdate })
			.expect(400);

		expect(res.body.message).toEqual(authErrorMessage.emailInUse);
	});
});

describe('Delete User', () => {});

it('test', () => {
	expect(true).toBe(true);
});
