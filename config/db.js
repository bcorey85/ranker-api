const mongoose = require('mongoose');

const dbConnect = async () => {
	try {
		await mongoose.connect('mongodb://localhost/ranker', {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});
		console.log('Connected to DB');
	} catch (error) {
		console.log(error);
	}
};

module.exports = dbConnect;
