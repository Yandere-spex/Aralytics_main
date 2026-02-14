const Story = require('../models/Story');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all stories
// @route   GET /api/stories
// @access  Private
exports.getAllStories = asyncHandler(async (req, res) => {
    const { category, level, search } = req.query;
    
    // Build query filter
    let filter = { isActive: true };
    
    if (category) {
        filter.category = category;
    }
    
    if (level) {
        filter.level = level;
    }
    
    if (search) {
        filter.$text = { $search: search };
    }
    
    const stories = await Story.find(filter)
        .select('-comprehensionQuestions') // Don't send questions yet
        .sort({ createdAt: -1 });
    
    res.status(200).json(
        new ApiResponse(200, stories, 'Stories retrieved successfully')
    );
    });

    // @desc    Get single story with questions
    // @route   GET /api/stories/:id
    // @access  Private
    exports.getStoryById = asyncHandler(async (req, res) => {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
        throw new ApiError(404, 'Story not found');
    }
    
    if (!story.isActive) {
        throw new ApiError(403, 'This story is not available');
    }
    
    res.status(200).json(
        new ApiResponse(200, story, 'Story retrieved successfully')
    );
    });

    // @desc    Get stories by category
    // @route   GET /api/stories/category/:category
    // @access  Private
    exports.getStoriesByCategory = asyncHandler(async (req, res) => {
    const stories = await Story.find({
        category: req.params.category,
        isActive: true
    }).select('-comprehensionQuestions');
    
    res.status(200).json(
        new ApiResponse(200, stories, `Stories in ${req.params.category} category`)
    );
    });

    // @desc    Get stories by level
    // @route   GET /api/stories/level/:level
    // @access  Private
    exports.getStoriesByLevel = asyncHandler(async (req, res) => {
    const { level } = req.params;
    
    if (!['Easy', 'Medium', 'Hard'].includes(level)) {
        throw new ApiError(400, 'Invalid level. Must be Easy, Medium, or Hard');
    }
    
    const stories = await Story.find({
        level: level,
        isActive: true
    }).select('-comprehensionQuestions');
    
    res.status(200).json(
        new ApiResponse(200, stories, `${level} level stories`)
    );
    });

    // @desc    Search stories
    // @route   GET /api/stories/search?q=keyword
    // @access  Private
    exports.searchStories = asyncHandler(async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        throw new ApiError(400, 'Search query is required');
    }
    
    const stories = await Story.find({
        $text: { $search: q },
        isActive: true
    }).select('-comprehensionQuestions');
    
    res.status(200).json(
        new ApiResponse(200, stories, 'Search results')
    );
    });

    // @desc    Get featured/popular stories
    // @route   GET /api/stories/featured
    // @access  Private
    exports.getFeaturedStories = asyncHandler(async (req, res) => {
    const stories = await Story.find({ isActive: true })
        .sort({ 'metadata.completionCount': -1 })
        .limit(6)
        .select('-comprehensionQuestions');
    
    res.status(200).json(
        new ApiResponse(200, stories, 'Featured stories')
    );
});