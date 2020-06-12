const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
	id: String,
	label: String,
	score: Number,
	weight: Number,
	weightedScore: Number
});

const itemSchema = new mongoose.Schema({
	id: String,
	label: String,
	scores: [ scoreSchema ],
	average: Number,
	weightedAverage: Number,
	rank: Number
});

const scoreLabelSchema = new mongoose.Schema({
	id: String,
	label: String,
	scores: [ scoreSchema ],
	average: Number,
	weight: Number
});

const rankFormSchema = new mongoose.Schema({
	date: {
		type: String,
		required: [ true, 'Please add a date to your form.' ]
	},
	title: {
		type: String,
		required: [ true, 'Please add a title to your form.' ]
	},
	category: {
		type: String
	},
	items: [ itemSchema ],
	scoreLabels: [ scoreLabelSchema ],
	overallAverage: Number,
	overallWeightedAverage: Number,
	options: {
		sort: {
			type: String,
			enum: [ 'asc', 'desc' ]
		},
		weightedAverage: {
			type: Boolean
		}
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const RankForm = new mongoose.model('RankForm', rankFormSchema);
module.exports = RankForm;
