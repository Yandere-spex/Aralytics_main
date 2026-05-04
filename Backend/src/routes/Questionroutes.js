// src/routes/questionRoutes.js
const express            = require('express');
const router             = express.Router();
const { getQuestions }   = require('../controllers/questionController');
const { protect }        = require('../middlewares/authMiddleware');

// GET /api/questions?difficulty=easy|medium|hard&limit=10&animal=&type=
router.get('/', protect, getQuestions);

module.exports = router;