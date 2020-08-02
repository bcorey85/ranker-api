const request = require('supertest');
const { app } = require('../../app');
const User = require('../../models/User');
const {
	authErrorMessage,
	genericErrorMessage,
	authSuccessMessage
} = require('../responseStrings');
const { userRoute } = require('../../routes/routeStrings');
const { login } = require('../../test/fixtures/login');
const mongoose = require('mongoose');

describe('Get User by Id', () => {
	it('returns user info if successful', async () => {
		const { userId, token } = await login();

		const res = await request(app)
			.get(`${userRoute.userIdRoot}/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(200);

		expect(res.body.message).toEqual('User data');
		expect(res.body.payload).toHaveProperty('user');
		expect(res.body.payload).toHaveProperty('categories');
	});

	it('throws error if user not found', async () => {
		const { token } = await login();

		const invalidUserId = mongoose.Types.ObjectId();

		const userUpdate = {
			email: 'modified@gmail.com',
			password: '123456'
		};

		const res = await request(app)
			.get(`${userRoute.userIdRoot}/${invalidUserId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ inputState: userUpdate })
			.expect(404);

		expect(res.body.message).toEqual(genericErrorMessage.notFound);
	});
});

describe('Update User', () => {
	it('updates user if successful', async () => {
		const { userId, token } = await login();

		const userUpdate = {
			email: 'modified@gmail.com',
			password: 'modified'
		};

		const res = await request(app)
			.put(`${userRoute.userIdRoot}/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ inputState: userUpdate })
			.expect(200);

		expect(res.body.message).toEqual(authSuccessMessage.userUpdateSuccess);

		const user = await User.findOne({ _id: userId });
		expect(user.email).toEqual('modified@gmail.com');

		const loginSuccess = await User.login(
			userUpdate.email,
			userUpdate.password
		);

		expect(loginSuccess.email).toEqual('modified@gmail.com');
		expect(loginSuccess._id).toEqual(user._id);
	});

	it('throws error if user not found', async () => {
		const { token } = await login();

		const invalidUserId = mongoose.Types.ObjectId();

		const userUpdate = {
			email: 'modified@gmail.com',
			password: '123456'
		};

		const res = await request(app)
			.put(`${userRoute.userIdRoot}/${invalidUserId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ inputState: userUpdate })
			.expect(404);

		expect(res.body.message).toEqual(genericErrorMessage.notFound);
	});

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

describe('Delete User', () => {
	it('deletes user on successful request', async () => {
		const { userId, token } = await login();

		const res = await request(app)
			.delete(`${userRoute.userIdRoot}/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(200);

		const users = await User.find();
		const exactUser = await User.findOne({ _id: userId });
		expect(users.length).toEqual(0);
		expect(exactUser).toEqual(null);
	});

	it('throws error if user not found', async () => {
		const { userId, token } = await login();

		const invalidUserId = mongoose.Types.ObjectId();

		const res = await request(app)
			.delete(`${userRoute.userIdRoot}/${invalidUserId}`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(404);

		expect(res.body.message).toEqual(genericErrorMessage.notFound);

		const user = await User.findOne({ _id: userId });
		expect(user._id).toEqual(userId);
	});
});
