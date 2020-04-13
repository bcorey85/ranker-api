const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
	id: String,
	label: String,
	score: Number
});

const itemSchema = new mongoose.Schema({
	id: String,
	label: String,
	scores: [ scoreSchema ],
	average: Number,
	rank: Number
});

const scoreLabelSchema = new mongoose.Schema({
	id: String,
	label: String,
	scores: [ scoreSchema ],
	average: Number
});

const rankFormSchema = new mongoose.Schema({
	items: [ itemSchema ],
	scoreLabels: [ scoreLabelSchema ],
	overallAverage: Number,
	sort: {
		type: String,
		enum: [ 'asc', 'desc' ]
	}
});

const RankForm = new mongoose.model('RankForm', rankFormSchema);
module.exports = RankForm;
