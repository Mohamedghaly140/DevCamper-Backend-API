const express = require('express');
const router = express.Router({ mergeParams: true });

const { getCourses, getCourse, addCourse } = require('../controllers/courses');

router.get('/', getCourses);

router.get('/:id', getCourse);

router.post('/', addCourse);

module.exports = router;
