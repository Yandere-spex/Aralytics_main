// src/services/quizService.js
const QuizSession = require('../models/QuizSession');
const QuizAttempt = require('../models/QuizAttempt');

const quizService = {

  // ── saveSession ───────────────────────────────────────────────────
  async saveSession({ userId, difficulty, totalQuestions, correctCount, score, pointsEarned, timeTaken, completedAt }) {
    const wrongCount = Number(totalQuestions) - Number(correctCount);
    const accuracy   = Number(totalQuestions) > 0
      ? Math.round((Number(correctCount) / Number(totalQuestions)) * 100)
      : 0;

    const session = await QuizSession.create({
      userId,
      difficulty,
      mode:           difficulty,
      totalQuestions: Number(totalQuestions),
      correctCount:   Number(correctCount),
      wrongCount,
      score:          Number(score),
      accuracy,
      pointsEarned:   Number(pointsEarned),
      timeTaken:      timeTaken != null ? Number(timeTaken) : null,
      completedAt:    completedAt ? new Date(completedAt) : new Date(),
    });

    return { sessionId: session._id };
  },

  // ── saveAttempt ───────────────────────────────────────────────────
  async saveAttempt({ userId, sessionId, questionId, animalName, type, difficulty, correct, timeTaken }) {
    const attempt = await QuizAttempt.create({
      userId,
      sessionId:  sessionId  || null,
      questionId: questionId || null,
      animalName: animalName || null,
      type,
      difficulty,
      correct:    Boolean(correct),
      timeTaken:  timeTaken != null ? Number(timeTaken) : null,
    });

    return { attemptId: attempt._id };
  },

  // ── saveComplete ──────────────────────────────────────────────────
  // Recommended: saves session + all answers in one call from QuizScreen
  async saveComplete({ userId, difficulty, totalQuestions, correctCount, score, pointsEarned, timeTaken, completedAt, answers = [] }) {
    const wrongCount = Number(totalQuestions) - Number(correctCount);
    const accuracy   = Number(totalQuestions) > 0
      ? Math.round((Number(correctCount) / Number(totalQuestions)) * 100)
      : 0;

    // 1️⃣ save session first so we have its _id
    const session = await QuizSession.create({
      userId,
      difficulty,
      mode:           difficulty,
      totalQuestions: Number(totalQuestions),
      correctCount:   Number(correctCount),
      wrongCount,
      score:          Number(score),
      accuracy,
      pointsEarned:   Number(pointsEarned),
      timeTaken:      timeTaken != null ? Number(timeTaken) : null,
      completedAt:    completedAt ? new Date(completedAt) : new Date(),
    });

    // 2️⃣ save all per-question attempts
    let insertedAttempts = 0;
    if (answers.length > 0) {
      const attemptDocs = answers.map(a => ({
        userId,
        sessionId:  session._id,
        questionId: a.questionId || null,
        animalName: a.animalName || null,
        type:       a.type,
        difficulty: a.difficulty ?? difficulty,
        correct:    Boolean(a.correct),
        timeTaken:  a.timeTaken != null ? Number(a.timeTaken) : null,
      }));

      const result     = await QuizAttempt.insertMany(attemptDocs);
      insertedAttempts = result.length;
    }

    return { sessionId: session._id, insertedAttempts };
  },

};

module.exports = quizService;