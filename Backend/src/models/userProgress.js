const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    overallStats: {
        totalStoriesCompleted: { type: Number, default: 0 },
        totalStoriesAttempted: { type: Number, default: 0 },
        totalReadingTime: { type: Number, default: 0 },
        currentLevel: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
        },
        averageMetrics: {
        comprehensionScore: Number,
        readingSpeed: Number,
        completionRate: Number
        }
    },
    
    levelStats: {
        easy: {
        storiesCompleted: { type: Number, default: 0 },
        storiesAttempted: { type: Number, default: 0 },
        averageComprehension: Number,
        averageSpeed: Number,
        bestScore: Number,
        worstScore: Number
        },
        medium: {
        storiesCompleted: { type: Number, default: 0 },
        storiesAttempted: { type: Number, default: 0 },
        averageComprehension: Number,
        averageSpeed: Number,
        bestScore: Number,
        worstScore: Number
        },
        hard: {
        storiesCompleted: { type: Number, default: 0 },
        storiesAttempted: { type: Number, default: 0 },
        averageComprehension: Number,
        averageSpeed: Number,
        bestScore: Number,
        worstScore: Number
        }
    },
    
    skillAnalysis: {
        recall: { 
        correct: { type: Number, default: 0 }, 
        total: { type: Number, default: 0 } 
        },
        inference: { 
        correct: { type: Number, default: 0 }, 
        total: { type: Number, default: 0 } 
        },
        analysis: { 
        correct: { type: Number, default: 0 }, 
        total: { type: Number, default: 0 } 
        }
    },
    
    recentStories: [{
        storyId: String,
        storyTitle: String,
        completedAt: Date,
        comprehensionScore: Number,
        readingSpeed: Number,
        passed: Boolean
    }],
    
    achievements: [{
        id: String,
        name: String,
        earnedAt: Date,
        category: String
    }],
    
    lastUpdated: {
        type: Date,
        default: Date.now
    }
    
    }, {
    timestamps: true
});

module.exports = mongoose.model('UserProgress', userProgressSchema);