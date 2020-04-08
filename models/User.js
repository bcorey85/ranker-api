const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	category: {
		type: String
	}
});

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	password: {
		type: String,
		required: true
	},
	categories: [ categorySchema ],
	rankForms: [ { type: mongoose.Types.ObjectId, ref: 'RankForm' } ]
});
