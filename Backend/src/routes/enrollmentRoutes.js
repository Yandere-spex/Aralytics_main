// routes/enrollmentRoutes.js
const express    = require('express');
const router     = express.Router();
const { protect }                               = require('../middlewares/authMiddleware');
const { joinClass, leaveClass } = require('../controllers/enrollmentController');

router.post  ('/join',  protect, joinClass);
router.delete('/leave', protect, leaveClass);

module.exports = router;