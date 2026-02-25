const express = require('express');
const router = express.Router();

// Check what your file is actually named on disk, then match it exactly
const { saveReadingResult, getMyResults, getMyStats } = require('../controllers/readingResultController');


const { protect } = require('../middlewares/authMiddleware');


router.post('/', protect, saveReadingResult);       // POST /api/reading-results
router.get('/', protect, getMyResults);             // GET  /api/reading-results
router.get('/stats', protect, getMyStats);          // GET  /api/reading-results/stats

module.exports = router;