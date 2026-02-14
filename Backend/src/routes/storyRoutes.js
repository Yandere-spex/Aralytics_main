const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// GET /api/stories - Get all stories with filters
router.get('/', storyController.getAllStories);

// GET /api/stories/featured - Get featured stories
router.get('/featured', storyController.getFeaturedStories);

// GET /api/stories/search - Search stories
router.get('/search', storyController.searchStories);

// GET /api/stories/category/:category - Get by category
router.get('/category/:category', storyController.getStoriesByCategory);

// GET /api/stories/level/:level - Get by level
router.get('/level/:level', storyController.getStoriesByLevel);

// GET /api/stories/:id - Get single story
router.get('/:id', storyController.getStoryById);

module.exports = router;