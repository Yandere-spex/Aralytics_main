// src/models/QuizAttempt.js
const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
    userId: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: true,
        index:    true,
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'QuizSession',
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  'Question',
    },
    animalName: { type: String, default: null },
    type: {
        type:     String,
        enum:     ['fact', 'sci', 'funfact', 'habitat'],
        required: true,
    },
    difficulty: {
        type:     String,
        enum:     ['easy', 'medium', 'hard'],
        required: true,
    },
    correct:   { type: Boolean, required: true },
    timeTaken: { type: Number,  default: null },  // seconds
    answeredAt:{ type: Date,    default: Date.now },
}, { timestamps: true });
// ✅ Use the correct schema name for this file
module.exports = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema);
//                                                                             ↑ this file's schema