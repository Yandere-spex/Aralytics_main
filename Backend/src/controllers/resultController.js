const ReadingResult = require('../models/ReadingResult');
const UserProgress = require('../models/userProgress');
const Story = require('../models/Story');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Save reading result
// @route   POST /api/results
// @access  Private
exports.saveReadingResult = asyncHandler(async (req, res) => {
    const {
        storyId,
        startTime,
        endTime,
        answers
    } = req.body;
    
    const userId = req.user.id;
    
    // Validate required fields
    if (!storyId || !startTime || !endTime || !answers) {
        throw new ApiError(400, 'Please provide all required fields');
    }
    
    // Get story
    const story = await Story.findById(storyId);
    if (!story) {
        throw new ApiError(404, 'Story not found');
    }
    
    // Calculate reading metrics
    const totalTimeSeconds = (new Date(endTime) - new Date(startTime)) / 1000;
    const wpm = Math.round((story.information.wordCount / totalTimeSeconds) * 60);
    
    // Determine reading speed status
    let speedStatus = 'Good pace';
    if (wpm < story.readingGuidelines.expectedWPM.min) {
        speedStatus = 'Too slow';
    } else if (wpm > story.readingGuidelines.expectedWPM.max) {
        speedStatus = 'Too fast';
    }
    
    // Process comprehension answers
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
        const question = story.comprehensionQuestions[index];
        const isCorrect = answer.userAnswer === question.correctAnswer;
        if (isCorrect) correctAnswers++;
        
        return {
        questionId: question.id,
        question: question.question,
        userAnswer: answer.userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeTaken: answer.timeTaken || 0,
        difficulty: question.difficulty,
        skill: question.skill
        };
    });
    
    const totalQuestions = story.comprehensionQuestions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Determine comprehension status
    let comprehensionStatus, feedback, passed;
    if (percentage === 100) {
        comprehensionStatus = 'Excellent';
        feedback = '🎉 Perfect score! Excellent comprehension!';
        passed = true;
    } else if (percentage >= 66) {
        comprehensionStatus = 'Good';
        feedback = '👍 Good work! Keep practicing!';
        passed = true;
    } else if (percentage >= 33) {
        comprehensionStatus = 'Needs Work';
        feedback = '📚 Review the story and try again.';
        passed = false;
    } else {
        comprehensionStatus = 'Failed';
        feedback = '❌ Student didn\'t comprehend the text — retake test or re-read story.';
        passed = false;
    }
    
    // Analyze strengths and weaknesses
    const skillStats = {};
    processedAnswers.forEach(answer => {
        if (!skillStats[answer.skill]) {
        skillStats[answer.skill] = { correct: 0, total: 0 };
        }
        skillStats[answer.skill].total++;
        if (answer.isCorrect) {
        skillStats[answer.skill].correct++;
        }
    });
    
    const strengths = [];
    const weaknesses = [];
    Object.keys(skillStats).forEach(skill => {
        const percentage = (skillStats[skill].correct / skillStats[skill].total) * 100;
        if (percentage >= 66) {
        strengths.push(skill);
        } else {
        weaknesses.push(skill);
        }
    });
    
    // Get attempt number
    const previousAttempts = await ReadingResult.countDocuments({
        userId,
        storyId
    });
    const attemptNumber = previousAttempts + 1;
    
    // Create reading result
    const readingResult = await ReadingResult.create({
        userId,
        storyId,
        storyTitle: story.information.title,
        storyLevel: story.level,
        storyCategory: story.category,
        storyWordCount: story.information.wordCount,
        
        readingMetrics: {
        startTime,
        endTime,
        totalTimeSeconds,
        readingSpeed: {
            wpm,
            status: speedStatus,
            expectedRange: story.readingGuidelines.expectedWPM
        }
        },
        
        comprehensionResults: {
        totalQuestions,
        correctAnswers,
        incorrectAnswers: totalQuestions - correctAnswers,
        score: correctAnswers,
        percentage,
        answers: processedAnswers,
        status: comprehensionStatus,
        feedback
        },
        
        assessment: {
        passed,
        overallStatus: passed ? 'Pass' : 'Retake',
        strengths,
        weaknesses,
        recommendation: feedback
        },
        
        attemptNumber,
        isRetake: attemptNumber > 1,
        device: req.headers['user-agent'] || 'Unknown',
        browser: req.headers['sec-ch-ua'] || 'Unknown'
    });
    
    // Update user progress
    await updateUserProgress(userId, readingResult, story);
    
    // Update story metadata
    await Story.findByIdAndUpdate(storyId, {
        $inc: { 'metadata.completionCount': 1 }
    });
    
    res.status(201).json(
        new ApiResponse(201, readingResult, 'Reading result saved successfully')
    );
    });

    // @desc    Get user's reading history
    // @route   GET /api/results/history
    // @access  Private
    exports.getReadingHistory = asyncHandler(async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    
    const results = await ReadingResult.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await ReadingResult.countDocuments({ userId: req.user.id });
    
    res.status(200).json(
        new ApiResponse(200, {
        results,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        }
        }, 'Reading history retrieved')
    );
    });

    // @desc    Get result by ID
    // @route   GET /api/results/:id
    // @access  Private
    exports.getResultById = asyncHandler(async (req, res) => {
    const result = await ReadingResult.findById(req.params.id);
    
    if (!result) {
        throw new ApiError(404, 'Result not found');
    }
    
    // Make sure user owns this result
    if (result.userId.toString() !== req.user.id) {
        throw new ApiError(403, 'Not authorized to access this result');
    }
    
    res.status(200).json(
        new ApiResponse(200, result, 'Result retrieved successfully')
    );
    });

    // @desc    Get user progress/stats
    // @route   GET /api/results/progress
    // @access  Private
    exports.getUserProgress = asyncHandler(async (req, res) => {
    let progress = await UserProgress.findOne({ userId: req.user.id });
    
    if (!progress) {
        // Create empty progress if doesn't exist
        progress = await UserProgress.create({ userId: req.user.id });
    }
    
    res.status(200).json(
        new ApiResponse(200, progress, 'User progress retrieved')
    );
    });

    // Helper function to update user progress
    async function updateUserProgress(userId, result, story) {
    let progress = await UserProgress.findOne({ userId });
    
    if (!progress) {
        progress = new UserProgress({ userId });
    }
    
    // Update overall stats
    progress.overallStats.totalStoriesAttempted++;
    if (result.assessment.passed) {
        progress.overallStats.totalStoriesCompleted++;
    }
    progress.overallStats.totalReadingTime += result.readingMetrics.totalTimeSeconds;
    
    // Update level stats
    const levelKey = story.level.toLowerCase();
    progress.levelStats[levelKey].storiesAttempted++;
    if (result.assessment.passed) {
        progress.levelStats[levelKey].storiesCompleted++;
    }
    
    // Update skill analysis
    result.comprehensionResults.answers.forEach(answer => {
        const skill = answer.skill;
        if (progress.skillAnalysis[skill]) {
        progress.skillAnalysis[skill].total++;
        if (answer.isCorrect) {
            progress.skillAnalysis[skill].correct++;
        }
        }
    });
    
    // Add to recent stories (keep last 10)
    progress.recentStories.unshift({
        storyId: story._id,
        storyTitle: story.information.title,
        completedAt: new Date(),
        comprehensionScore: result.comprehensionResults.percentage,
        readingSpeed: result.readingMetrics.readingSpeed.wpm,
        passed: result.assessment.passed
    });
    progress.recentStories = progress.recentStories.slice(0, 10);
    
    progress.lastUpdated = new Date();
    await progress.save();
}

module.exports = exports;