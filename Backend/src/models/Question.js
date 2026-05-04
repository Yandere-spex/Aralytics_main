// src/models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    animalName: { type: String, required: true, index: true },
    difficulty: {
        type:     String,
        enum:     ['easy', 'medium', 'hard'],
        required: true,
        index:    true,
    },
    type: {
        type:     String,
        enum:     ['fact', 'sci', 'funfact', 'habitat'],  // Perfect order!
        required: true,
    },
    question:      { type: String,   required: true },
    choices:       { type: [String], required: true },
    correctAnswer: { type: Number,   required: true, min: 0, max: 3 },  // ← FIXED!
    points:        { type: Number,   default: 10 },
    funFact:       { type: String,   default: null },
    imageUrl:      { type: String,   default: null },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);