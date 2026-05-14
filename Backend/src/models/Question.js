// src/models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    animalName:    { type: String,   required: true, index: true },
    difficulty: {
        type:     String,
        enum:     ['easy', 'medium', 'hard'],
        required: true,
        index:    true,
    },
    type: {
        type: String,
        enum: ['fact', 'sci', 'funfact', 'habitat'],
        required: true,
    },
    questionText:  { type: String,   default: null },
    options:       { type: [String], default: [] },
    correctAnswer: { type: String,   default: null },
    relatedLetter: { type: String,   default: null },
    timesAnswered: { type: Number,   default: 0 },
    timesCorrect:  { type: Number,   default: 0 },
    isActive:      { type: Boolean,  default: true },
    points:        { type: Number,   default: 10 },
    funFact:       { type: String,   default: null },
    imageUrl:      { type: String,   default: null },
}, {
    timestamps: true,
    collection: 'alphabetQuestion',
    strict: false,
});

module.exports = mongoose.models.Question || mongoose.model('Question', QuestionSchema);