// src/routes/quizRoutes.js
const express                                      = require('express');
const router                                       = express.Router();
const { saveSession, saveAttempt, saveComplete }   = require('../controllers/quizController');
const { protect }                                  = require('../middlewares/authMiddleware');

// All quiz write routes require auth
router.post('/session',  protect, saveSession);   // save one game session
router.post('/attempt',  protect, saveAttempt);   // save one question answer
router.post('/complete', protect, saveComplete);  // save session + all answers (recommended)

module.exports = router;