const mongoose = require('mongoose');

const questionResultSchema = new mongoose.Schema({
    question: { type: String, required: true },
    userAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
}, { _id: false });

const readingResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    storyTitle: { type: String, required: true },

    // WPM / Speed
    totalSeconds: { type: Number, required: true },
    totalMilliseconds: { type: Number },
    wpm: { type: Number, required: true },
    wordCount: { type: Number, required: true },
    expectedWPM: { type: String },        // e.g. "150-250 WPM"
    speedRemark: { type: String },        // "✅ Good pace!"
    speedColor: { type: String },         // "#22c55e"

    // Comprehension
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true }, // 0-100
    userAnswers: [String],
    correctAnswers: [String],
    remark: { type: String },             // "🌟 Excellent comprehension!"
    interpretation: { type: String },
    questionResults: [questionResultSchema],

    completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('ReadingResult', readingResultSchema);