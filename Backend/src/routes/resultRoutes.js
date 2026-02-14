const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// POST /api/results - Save reading result
router.post('/', resultController.saveReadingResult);

// GET /api/results/history - Get reading history
router.get('/history', resultController.getReadingHistory);

// GET /api/results/progress - Get user progress
router.get('/progress', resultController.getUserProgress);

// GET /api/results/:id - Get specific result
router.get('/:id', resultController.getResultById);

module.exports = router;