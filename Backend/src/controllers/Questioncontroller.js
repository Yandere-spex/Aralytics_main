// src/controllers/questionController.js
const asyncHandler      = require('../utils/asyncHandler');
const ApiError          = require('../utils/ApiError');
const questionService   = require('../services/questionService');

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];
const VALID_TYPES        = ['fact', 'sci', 'funfact', 'habitat'];

// GET /api/questions?difficulty=easy|medium|hard&limit=10&animal=&type=
exports.getQuestions = asyncHandler(async (req, res) => {
  const { difficulty, animal, type } = req.query;
  const limit = parseInt(req.query.limit) || 10;

  if (!difficulty) {
    throw new ApiError(400, 'difficulty is required (easy | medium | hard)');
  }
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    throw new ApiError(400, `difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
  }
  if (type) {
    const types = type.split(',').map(t => t.trim());
    const bad   = types.filter(t => !VALID_TYPES.includes(t));
    if (bad.length) {
      throw new ApiError(400, `Invalid type(s): ${bad.join(', ')}. Must be: ${VALID_TYPES.join(', ')}`);
    }
  }

  const result = await questionService.getQuestions({ difficulty, limit, animal, type });

  res.status(200).json({
    success:   true,
    total:     result.total,
    questions: result.questions,
  });
});