// src/routes/teacher.js
const express        = require('express');
const router         = express.Router();
const {
    getTeacherDashboard,
    enrollStudent,
    enrollByCode,
    getClassCode,
} = require('../controllers/teacherController');
const { protect }    = require('../middlewares/authMiddleware');
const requireTeacher = require('../middlewares/requireTeacher');

// Teacher routes
router.get('/dashboard',          protect, requireTeacher, getTeacherDashboard);
router.get('/class-code',         protect, requireTeacher, getClassCode);
router.post('/enroll/:studentId', protect, requireTeacher, enrollStudent);

// Student route — self-enroll using a class code
router.post('/enroll-by-code',    protect, enrollByCode);

module.exports = router;