const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const error = require('./middleware/error');
const connectDB = require('./config/db');

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
const coursesRoutes = require('./routes/courses');

// Routes
app.use('/api/v1/bootcamps', bootcampsRoutes);
app.use('/api/v1/courses', coursesRoutes);

// Error Handler
app.use(error);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`
			.yellow.bold
	)
);
