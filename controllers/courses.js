const ErrorResponse = require('../utils/ErrorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

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
			.populate({
				path: 'bootcamp',
				select: 'name description',
			})
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

// @desc     Get single course
// @route    GET /api/v1/courses
// @access   Public
exports.getCourse = (req, res, next) => {
	const courseId = req.params.id;
	Course.findById(courseId)
		.populate({
			path: 'bootcamp',
			select: 'name description',
		})
		.then(data => {
			if (!data) {
				return next(
					new ErrorResponse(
						`No course with the id of ${req.params.id} match any courses in database`,
						404
					)
				);
			}
			res.status(200).json({
				success: true,
				data: data,
			});
		})
		.catch(err => {
			next(err);
		});
};

// @desc     Add single course
// @route    POST /api/v1/courses
// @route    POST /api/v1/bootcamps/:bootcampId/courses
// @access   Private
exports.addCourse = (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	Bootcamp.findById(req.params.bootcampId)
		.then(data => {
			if (!data) {
				return next(
					new ErrorResponse(
						`No bootcamo with the id of ${req.params.id} match any bootcamps in database`,
						404
					)
				);
			}

			return Course.create(req.body);
		})
		.then(data => {
			res.status(201).json({
				success: true,
				data: data,
			});
		})
		.catch(err => {
			next(err);
		});
};

// @desc     Update course
// @route    PUT /api/v1/courses/:id
// @access   Private
exports.updateCourse = (req, res, next) => {
	const courseId = req.params.id;
	Course.findByIdAndUpdate(courseId, req.body, {
		new: true,
		runValidators: true,
	})
		.then(data => {
			if (!data) {
				return next(
					new ErrorResponse(
						`No course with the id of ${req.params.id} match any courses in database`,
						404
					)
				);
			}
			res.status(200).json({
				success: true,
				data: data,
			});
		})
		.catch(err => {
			next(err);
		});
};

// @desc     Delete course
// @route    DELETE /api/v1/courses/:id
// @access   Private
exports.deleteCourse = (req, res, next) => {
	const courseId = req.params.id;
	Course.remove({ _id: courseId })
		.then(data => {
			if (!data) {
				return next(
					new ErrorResponse(
						`No course with the id of ${req.params.id} match any courses in database`,
						404
					)
				);
			}
			res.status(200).json({
				success: true,
				message: 'Course deleted succsfuly',
			});
		})
		.catch(err => {
			next(err);
		});
};
