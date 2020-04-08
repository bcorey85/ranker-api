const mongoose = require('mongoose');

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
