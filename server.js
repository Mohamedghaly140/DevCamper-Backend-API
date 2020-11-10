const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

const app = express();

// body parser middleware
app.use(express.json());

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Routes Files
const bootcampsRoutes = require('./routes/bootcamps');

// Routes
app.use('/api/v1/bootcamps', bootcampsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`
			.yellow.bold
	)
);
