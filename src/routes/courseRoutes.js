const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const courseController =require("../controllers/courseController");


// console.log(createCourse);
// Define the routes and connect with courseController methods

// Create a new course (instructor only)
// router.post('/courses', authenticate, authorizeRoles('INSTRUCTOR'),courseController.createCourse);
router.post('/courses',authenticate,authorizeRoles('INSTRUCTOR'),courseController.createCourse);

// Get all courses
router.get('/courses',courseController.getAllCourses);

// get all published course for student     
router.get('/published', courseController.getPublishedCourses);

// Get a course by ID
router.get('/courses/:id',courseController.getCourseById);

// Update a course (instructor only)
router.put('/:id', authenticate, authorizeRoles('INSTRUCTOR'),courseController.updateCourse);

// Delete a course (instructor only)
router.delete('/courses/:id', authenticate, authorizeRoles('INSTRUCTOR'),courseController.deleteCourse);

// router.get('/analytics/enrollment-chart', authenticate, authorizeRoles('INSTRUCTOR'), courseController.getEnrollmentChartData);



module.exports = router;
 