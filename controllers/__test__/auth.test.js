const request = require('supertest');
const { app } = require('../../app');
const User = require('../../models/User');
const { authErrorMessage } = require('../../errors/errorStrings');

describe('User Register', () => {
	it('creates a new user if valid email and password provided', async () => {
		const user = {
			username: 'test',
			email: 'test@gmail.com',
			password: '123456'
		};

		const res = await request(app)
			.post('/auth/register')
			.send(user)
			.expect(201);

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
			.post('/auth/register')
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
			.post('/auth/register')
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
			.post('/auth/register')
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
			.post('/auth/register')
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
			.post('/auth/login')
			.send(user)
			.expect(200);
	});
});

// describe('Forgot Password', () => {});

// describe('Reset Password', () => {});
