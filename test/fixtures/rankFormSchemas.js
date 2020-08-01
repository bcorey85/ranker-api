const mongoose = require('mongoose');

const score1 = {
	id: mongoose.Types.ObjectId(),
	label: 'Label 1',
	score: 5,
	weight: null,
	weightedScore: null
};

const score2 = {
	id: mongoose.Types.ObjectId(),
	label: 'Label 1',
	score: 5,
	weight: null,
	weightedScore: null
};

const score3 = {
	id: mongoose.Types.ObjectId(),
	label: 'Label 2',
	score: 5,
	weight: null,
	weightedScore: null
};

const score4 = {
	id: mongoose.Types.ObjectId(),
	label: 'Label 2',
	score: 5,
	weight: null,
	weightedScore: null
};

const item1 = {
	id: mongoose.Types.ObjectId(),
	label: 'Label 1',
	scores: [ score1, score2 ],
	average: 8.4,
	weightedAverage: null,
	rank: 1
};

const item2 = {
	id: mongoose.Types.ObjectId(),
	label: 'Label 2',
	scores: [ score3, score4 ],
	average: 8.3,
	weightedAverage: null,
	rank: 2
};

const scoreLabel1 = {
	id: mongoose.Types.ObjectId(),
	label: 'Label 1',
	scores: [ score1, score2 ],
	average: 5,
	weight: null
};

const scoreLabel2 = {
	id: mongoose.Types.ObjectId(),
	label: 'Label 2',
	scores: [ score3, score4 ],
	average: 5,
	weight: null
};

const rankForm = {
	id: mongoose.Types.ObjectId(),
	date: '1/1/2020',
	title: 'Rank Form One',
	category: 'Misc',
	items: [ item1, item2 ],
	scoreLabels: [ scoreLabel1, scoreLabel2 ],
	overageAverage: 5,
	overallWeightedAverage: null,
	options: {
		sort: 'asc',
		weightedAverage: false
	}
};

module.exports = {
	score1,
	score2,
	score3,
	score4,
	item1,
	item2,
	scoreLabel1,
	scoreLabel2,
	rankForm
};
