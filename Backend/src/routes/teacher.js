const express              = require('express');
const router               = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getDashboard }     = require('../controllers/teacherController');

// @route  GET /api/teacher/dashboard
router.get('/dashboard', protect, getDashboard);

module.exports = router;