const express = require('express');
const router = express.Router();

// Bootcamp Controller
const {
	getBootcamps,
	getBootcamp,
	createtBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
} = require('../controllers/bootcamps');

// Include other resource routers
const courseRouter = require('./courses');

// Re-route into other resouce router
router.use('/:bootcampId/courses', courseRouter);

router.get('/', getBootcamps);

router.get('/:id', getBootcamp);

router.post('/', createtBootcamp);

router.put('/:id', updateBootcamp);

router.delete('/:id', deleteBootcamp);

router.get('/radius/:zipcode/:distance', getBootcampsInRadius);

module.exports = router;
