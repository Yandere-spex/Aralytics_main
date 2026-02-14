const mongoose = require('mongoose');

const readingResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    storyId: {
        type: String,
        required: true,
        index: true
    },
    
    // Story info (saved for quick access)
    storyTitle: String,
    storyLevel: String,
    storyCategory: String,
    storyWordCount: Number,
    
    // Reading performance
    readingMetrics: {
        startTime: Date,
        endTime: Date,
        totalTimeSeconds: Number,
        readingSpeed: {
        wpm: Number,
        status: {
            type: String,
            enum: ['Too fast', 'Good pace', 'Too slow']
        },
        expectedRange: {
            min: Number,
            max: Number
        }
        }
    },
    
    // Comprehension results
    comprehensionResults: {
        totalQuestions: Number,
        correctAnswers: Number,
        incorrectAnswers: Number,
        score: Number,
        percentage: Number,
        
        answers: [{
        questionId: String,
        question: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        timeTaken: Number,
        difficulty: String,
        skill: String
        }],
        
        status: {
        type: String,
        enum: ['Excellent', 'Good', 'Needs Work', 'Failed']
        },
        feedback: String
    },
    
    // Overall assessment
    assessment: {
        passed: Boolean,
        overallStatus: {
        type: String,
        enum: ['Pass', 'Fail', 'Retake']
        },
        strengths: [String],
        weaknesses: [String],
        recommendation: String
    },
    
    // Attempt tracking
    attemptNumber: {
        type: Number,
        default: 1
    },
    isRetake: {
        type: Boolean,
        default: false
    },
    previousAttemptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReadingResult'
    },
    
    // Session info
    device: String,
    browser: String
    
    }, {
    timestamps: true
});

// Compound indexes for faster queries
readingResultSchema.index({ userId: 1, createdAt: -1 });
readingResultSchema.index({ userId: 1, storyId: 1 });

module.exports = mongoose.model('ReadingResult', readingResultSchema);