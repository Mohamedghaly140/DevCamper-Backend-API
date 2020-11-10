const mongoose = require('mongoose');

const connectDB = () => {
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		})
		.then(() => console.log('MongoDB Connected...'))
		.catch(err => {
			console.error(err.message);
			process.exit(1);
		});
};

module.exports = connectDB;