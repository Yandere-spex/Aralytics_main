// src/models/QuizSession.js
const mongoose = require('mongoose');

const quizSessionSchema = new mongoose.Schema({
    userId: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
        index:    true,
    },
    difficulty: {
        type:     String,
        enum:     ['easy', 'medium', 'hard'],
        required: true,
    },
    mode: {
        type: String, // alias of difficulty, kept for Dashboard compat
    },
    totalQuestions: { type: Number, required: true },
    correctCount:   { type: Number, required: true },
    wrongCount:     { type: Number, default: 0 },
    score:          { type: Number, required: true },  // 0–100
    accuracy:       { type: Number, default: 0 },      // 0–100
    pointsEarned:   { type: Number, required: true },
    timeTaken:      { type: Number, default: null },   // seconds
    completedAt:    { type: Date,   default: Date.now },
}, { timestamps: true });
module.exports = mongoose.models.QuizSession || mongoose.model('QuizSession', quizSessionSchema);
