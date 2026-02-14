const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Validation rules for saving result
exports.validateResult = [
    body('storyId').notEmpty().withMessage('Story ID is required'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required'),
    body('answers').isArray({ min: 1 }).withMessage('Answers array is required'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        throw new ApiError(400, errorMessages);
        }
        next();
    }
];