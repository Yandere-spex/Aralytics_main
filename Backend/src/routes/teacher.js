const express    = require('express');
const router     = express.Router();
const { getTeacherDashboard, enrollStudent } = require('../controllers/teacherController');
const protect        = require('../middleware/authMiddleware');       // your existing auth middleware
const requireTeacher = require('../middleware/requireTeacher');

router.get('/dashboard',          protect, requireTeacher, getTeacherDashboard);
router.post('/enroll/:studentId', protect, requireTeacher, enrollStudent);

module.exports = router;