// src/controllers/quizController.js
const asyncHandler  = require('../utils/asyncHandler');
const ApiError      = require('../utils/ApiError');
const quizService = require('../services/quizService');

// ── POST /api/quiz/session ────────────────────────────────────────
exports.saveSession = asyncHandler(async (req, res) => {
  const required = ['difficulty', 'totalQuestions', 'correctCount', 'score', 'pointsEarned'];
  const missing  = required.filter(k => req.body[k] == null);
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }

  const result = await quizService.saveSession({
    userId: req.user._id,   // ← from protect middleware
    ...req.body,
  });

  res.status(201).json({
    success:   true,
    message:   'Session saved',
    sessionId: result.sessionId,
  });
});

// ── POST /api/quiz/attempt ────────────────────────────────────────
exports.saveAttempt = asyncHandler(async (req, res) => {
  const required = ['sessionId', 'questionId', 'type', 'difficulty', 'correct'];
  const missing  = required.filter(k => req.body[k] == null);
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }

  const result = await quizService.saveAttempt({
    userId: req.user._id,
    ...req.body,
  });

  res.status(201).json({
    success:   true,
    message:   'Attempt saved',
    attemptId: result.attemptId,
  });
});

// ── POST /api/quiz/complete ───────────────────────────────────────
// Recommended — saves session + all answers in one call
exports.saveComplete = asyncHandler(async (req, res) => {
  const required = ['difficulty', 'totalQuestions', 'correctCount', 'score', 'pointsEarned'];
  const missing  = required.filter(k => req.body[k] == null);
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }

  const result = await quizService.saveComplete({
    userId: req.user._id,
    ...req.body,
  });

  res.status(201).json({
    success:          true,
    message:          'Quiz complete saved',
    sessionId:        result.sessionId,
    insertedAttempts: result.insertedAttempts,
  });
});