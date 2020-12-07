const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const geocoder = require('../utils/geocoder');

// @desc     Get all bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
exports.getBootcamps = (req, res, next) => {
	let query;

	// Copy req.query
	const reqQuery = { ...req.query };

	// Field to exclude
	const removeFields = ['select', 'sort'];

	// loop over removeFields and delete them from reqQuery
	removeFields.forEach(field => delete reqQuery[field]);

	let queryStr = JSON.stringify(reqQuery);

	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		match => `$${match}`
	);

	query = JSON.parse(queryStr);

	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		return Bootcamp.find(query)
			.populate('courses')
			.select(fields)
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

	Bootcamp.find(query)
		.populate('courses')
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
};

// @desc     Get single bootcamp
// @route    GET /api/v1/bootcamps/:id
// @access   Public
exports.getBootcamp = (req, res, next) => {
	Bootcamp.findById(req.params.id)
		.then(data => {
			if (!data) {
				return next(
					new ErrorResponse(
						`Bootcamp id ${req.params.id} dose not match any bootcamps in database`,
						404
					)
				);
			}
			res.status(200).json({ success: true, data: data });
		})
		.catch(err => {
			next(err);
		});
};

// @desc     Create new bootcamp
// @route    POST /api/v1/bootcamps
// @access   Private
exports.createtBootcamp = (req, res, next) => {
	Bootcamp.create(req.body)
		.then(data => {
			res.status(201).json({ success: true, data: data });
		})
		.catch(err => {
			next(err);
		});
};

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
// @access   Private
exports.updateBootcamp = (req, res, next) => {
	Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})
		.then(data => {
			if (!data) {
				return next(
					new ErrorResponse(
						`Bootcamp id ${req.params.id} dose not match any bootcamps in database`,
						404
					)
				);
			}
			res.status(200).json({ success: true, data: data });
		})
		.catch(err => {
			next(err);
		});
};

// @desc     Delete bootcamp
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
exports.deleteBootcamp = (req, res, next) => {
	Bootcamp.findByIdAndDelete(req.params.id)
		.then(data => {
			if (!data) {
				return next(
					new ErrorResponse(
						`Bootcamp id ${req.params.id} dose not match any bootcamps in database`,
						404
					)
				);
			}
			res.status(200).json({ success: true, data: data });
		})
		.catch(err => {
			next(err);
		});
};

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calc radius using radians
	// Divide dist by radius of Earth
	// Earth Radius = 3,963 mi / 6,378 km
	const radius = distance / 3963;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
};
