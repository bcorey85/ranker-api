const RankForm = require('../../models/RankForm');
const User = require('../../models/User');
const request = require('supertest');
const { app } = require('../../app');
const {
	genericErrorMessage,
	formSuccessMessage,
	formErrorMessage
} = require('../responseStrings');
const { rankRoute } = require('../../routes/routeStrings');
const { rankForm } = require('../../test/fixtures/rankFormSchemas');
const { login } = require('../../test/fixtures/login');

describe('Create Rankform', () => {
	it('creates a form and adds to user if valid request made', async () => {
		const { userId, token } = await login();

		const res = await request(app)
			.post(rankRoute.root)
			.set('Authorization', `Bearer ${token}`)
			.send(rankForm)
			.expect(201);

		expect(res.body.message).toEqual(formSuccessMessage.formSaveSuccess);

		const user = await User.findOne({ _id: userId }).populate({
			path: 'rankForms',
			model: RankForm
		});

		expect(user.rankForms.length).toEqual(1);
		expect(user.rankForms[0].title).toEqual(rankForm.title);
	});

	it('throws error if user is not authenticated', async () => {
		const res = await request(app)
			.post(rankRoute.root)
			.send(rankForm)
			.expect(401);

		expect(res.body.message).toEqual(
			genericErrorMessage.invalidCredentials
		);

		const forms = await RankForm.find({});
		expect(forms.length).toBe(0);
	});

	it('throws error if form items are empty', async () => {
		const { token } = await login();
		const newForm = { ...rankForm };
		newForm.items = [];

		const res = await request(app)
			.post(rankRoute.root)
			.set('Authorization', `Bearer ${token}`)
			.send(newForm)
			.expect(400);

		expect(res.body.message).toEqual(formErrorMessage.formMissingError);

		const forms = await RankForm.find({});
		expect(forms.length).toBe(0);
	});

	it('throws error if form is missing date', async () => {
		const { token } = await login();
		const newForm = { ...rankForm };
		newForm.date = '';

		const res = await request(app)
			.post(rankRoute.root)
			.set('Authorization', `Bearer ${token}`)
			.send(newForm)
			.expect(400);

		expect(res.body.message[0]).toEqual(formErrorMessage.formDateMissing);

		const forms = await RankForm.find({});
		expect(forms.length).toBe(0);
	});

	it('throws error if form is missing title', async () => {
		const { token } = await login();
		const newForm = { ...rankForm };
		newForm.title = '';

		const res = await request(app)
			.post(rankRoute.root)
			.set('Authorization', `Bearer ${token}`)
			.send(newForm)
			.expect(400);

		expect(res.body.message[0]).toEqual(formErrorMessage.formTitleMissing);

		const forms = await RankForm.find({});
		expect(forms.length).toBe(0);
	});
});

describe('Get Rank Form by Id', () => {
	it('Not currently implemented', () => {
		expect(true).toBe(true);
	});
});

describe('Update Rankform', () => {
	it('updates form if valid request made', async () => {
		const { token } = await login();

		const form = new RankForm(rankForm);
		await form.save();

		const formId = form._id;

		const modifiedForm = { ...rankForm };
		modifiedForm.title = 'Modified';

		const res = await request(app)
			.put(`${rankRoute.rankFormIdRoot}/${formId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(modifiedForm)
			.expect(200);

		expect(res.body.message).toEqual(formSuccessMessage.formUpdateSuccess);

		const originalForm = await RankForm.findOne({ _id: formId });
		expect(originalForm.title).toEqual('Modified');
	});

	it('throws error if user is not authenticated', async () => {
		const form = new RankForm(rankForm);
		await form.save();

		const formId = form._id;

		const modifiedForm = { ...rankForm };
		modifiedForm.title = 'Modified';

		const res = await request(app)
			.put(`${rankRoute.rankFormIdRoot}/${formId}`)
			.send(modifiedForm)
			.expect(401);

		expect(res.body.message).toEqual(
			genericErrorMessage.invalidCredentials
		);

		const originalForm = await RankForm.findOne({ _id: formId });
		expect(originalForm.title).toEqual(rankForm.title);
	});

	it('throws error if form items are empty', async () => {
		const { token } = await login();

		const form = new RankForm(rankForm);
		await form.save();

		const formId = form._id;

		const modifiedForm = { ...rankForm };
		modifiedForm.items = [];

		const res = await request(app)
			.put(`${rankRoute.rankFormIdRoot}/${formId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(modifiedForm)
			.expect(400);

		expect(res.body.message).toEqual(formErrorMessage.formMissingError);

		const originalForm = await RankForm.findOne({ _id: formId });
		expect(originalForm.items[0].title).toEqual(rankForm.items[0].title);
	});

	it('throws error if form is missing date', async () => {
		const { token } = await login();

		const form = new RankForm(rankForm);
		await form.save();

		const formId = form._id;

		const modifiedForm = { ...rankForm };
		modifiedForm.date = '';

		const res = await request(app)
			.put(`${rankRoute.rankFormIdRoot}/${formId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(modifiedForm)
			.expect(400);

		expect(res.body.message[0]).toEqual(formErrorMessage.formDateMissing);

		const originalForm = await RankForm.findOne({ _id: formId });
		expect(originalForm.date).toEqual(rankForm.date);
	});

	it('throws error if form is missing title', async () => {
		const { token } = await login();

		const form = new RankForm(rankForm);
		await form.save();

		const formId = form._id;

		const modifiedForm = { ...rankForm };
		modifiedForm.title = '';

		const res = await request(app)
			.put(`${rankRoute.rankFormIdRoot}/${formId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(modifiedForm)
			.expect(400);

		expect(res.body.message[0]).toEqual(formErrorMessage.formTitleMissing);

		const originalForm = await RankForm.findOne({ _id: formId });
		expect(originalForm.title).toEqual(rankForm.title);
	});
});

describe('Delete Rankform', () => {
	it('deletes form if valid request made', async () => {
		const { token } = await login();

		const form = new RankForm(rankForm);
		await form.save();

		const formId = form._id;

		const res = await request(app)
			.delete(`${rankRoute.rankFormIdRoot}/${formId}`)
			.set('Authorization', `Bearer ${token}`)
			.send()
			.expect(200);

		expect(res.body.message).toEqual(formSuccessMessage.formDeleteSuccess);

		const originalForm = await RankForm.findOne({ _id: formId });
		expect(originalForm).toEqual(null);
	});

	it('throws error if user is not authenticated', async () => {
		const form = new RankForm(rankForm);
		await form.save();

		const formId = form._id;

		const res = await request(app)
			.delete(`${rankRoute.rankFormIdRoot}/${formId}`)
			.send()
			.expect(401);

		expect(res.body.message).toEqual(
			genericErrorMessage.invalidCredentials
		);

		const originalForm = await RankForm.findOne({ _id: formId });
		expect(originalForm.title).toEqual(rankForm.title);
	});
});
