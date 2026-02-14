const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true // For faster queries
    },
    level: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
        index: true
    },
    ageRange: String,
    
    cover: {
        url: String,
        filename: String,
        size: Number,
        mimeType: String,
        width: Number,
        height: Number,
        alt: String
    },
    
    information: {
        title: {
        type: String,
        required: true
        },
        wordCount: Number,
        shortStory: {
        type: String,
        required: true
        },
        estimatedReadingTime: String,
        author: String,
        theme: String,
        tags: [String]
    },
    
    comprehensionQuestions: [{
        id: String,
        question: String,
        options: [String],
        correctAnswer: String,
        difficulty: String,
        skill: String
    }],
    
    readingGuidelines: {
        expectedWPM: {
        min: { type: Number, default: 150 },
        max: { type: Number, default: 250 }
        },
        minScore: { type: Number, default: 66 }
    },
    
    metadata: {
        completionCount: { type: Number, default: 0 },
        avgComprehension: Number,
        avgSpeed: Number
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for text search
storySchema.index({ 'information.title': 'text' });

module.exports = mongoose.model('Story', storySchema);