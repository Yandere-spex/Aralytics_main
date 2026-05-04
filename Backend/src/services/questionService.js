// src/services/questionService.js
const Question = require('../models/Question');

const questionService = {

  async getQuestions({ difficulty, limit = 10, animal, type }) {
    const capped = Math.min(Number(limit), 50);

    // ── build filter ─────────────────────────────────────────────
    const filter = { difficulty };

    if (animal) {
      filter.animalName = { $regex: new RegExp(`^${escapeRegex(animal)}$`, 'i') };
    }

    if (type) {
      const types = type.split(',').map(t => t.trim());
      filter.type = types.length === 1 ? types[0] : { $in: types };
    }

    // ── count total matching ─────────────────────────────────────
    const total = await Question.countDocuments(filter);
    if (total === 0) return { questions: [], total: 0 };

    // ── random sample via $sample aggregation ────────────────────
    let questions;
    if (capped >= total) {
      questions = await Question.find(filter).lean();
      questions = shuffle(questions);
    } else {
      questions = await Question.aggregate([
        { $match: filter },
        { $sample: { size: capped } },
      ]);
    }

    // ── shape response ───────────────────────────────────────────
    const shaped = questions.map(q => ({
      _id:           q._id,
      animalName:    q.animalName,
      difficulty:    q.difficulty,
      type:          q.type,
      question:      q.question,
      choices:       q.choices,
      correctAnswer: q.correctAnswer,
      points:        q.points ?? defaultPoints(q.difficulty),
      funFact:       q.funFact  ?? null,
      imageUrl:      q.imageUrl ?? null,
    }));

    return { questions: shaped, total };
  },

};

// ── helpers ──────────────────────────────────────────────────────
function defaultPoints(difficulty) {
  return { easy: 10, medium: 20, hard: 30 }[difficulty] ?? 10;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = questionService;