const Course = require('../models/Course');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc     Get all bootcamps
// @route    GET /api/v1/courses
// @route    GET /api/v1/bootcamps/:bootcampId/courses
// @access   Public
exports.getCourses = (req, res, next) => {
	if (req.params.bootcampId) {
		Course.find({ bootcamp: req.params.bootcampId })
			.then(data => {
				res.status(200).json({
					success: true,
					count: data.length,
					data: data,
				});
			})
			.catch(err => {
				next(err);
			});
	} else {
		Course.find()
			.then(data => {
				res.status(200).json({
					success: true,
					count: data.length,
					data: data,
				});
			})
			.catch(err => {
				next(err);
			});
	}
};
