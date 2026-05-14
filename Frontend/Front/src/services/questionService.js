// src/services/questionService.js
const Question = require('../models/Question');

exports.getQuestions = async ({ difficulty, limit = 10, animal, type }) => {
    const filter = { difficulty, isActive: true };

    if (animal) filter.animalName = { $regex: animal, $options: 'i' };

    if (type) {
        const types = type.split(',').map(t => t.trim());
        filter.type = { $in: types };
    }

    const questions = await Question.find(filter)
        .limit(limit)
        .lean();

    // Shuffle so every call returns a different order
    const shuffled = questions.sort(() => Math.random() - 0.5);

    return {
        total:     shuffled.length,
        questions: shuffled,
    };
};