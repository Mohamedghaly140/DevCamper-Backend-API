const express = require('express');
const router = express.Router();

// Bootcamp Controller
const {
	getBootcamps,
	getBootcamp,
	createtBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require('../controllers/bootcamps');

router.get('/', getBootcamps);

router.get('/:id', getBootcamp);

router.post('/', createtBootcamp);

router.put('/:id', updateBootcamp);

router.delete('/:id', deleteBootcamp);

module.exports = router;
