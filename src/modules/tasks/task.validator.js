const { body, param, validationResult } = require('express-validator');
const ApiError = require('../../utils/ApiError');

/**
 * Validator for MongoDB ObjectId in URL params
 */
const mongoIdParam = [
  param('id').isMongoId().withMessage('Invalid task ID'),
];

/**
 * Validation chain for creating a task
 */
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format (ISO 8601 required)')
    .toDate(),
];

/**
 * Validation chain for updating a task (all fields optional)
 */
const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format (ISO 8601 required)')
    .toDate(),
];

/**
 * Validation chain for updating only the status
 */
const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
];

/**
 * Middleware to execute validation and handle errors.
 * Reuses the pattern from auth.validator.js.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => err.msg);
    return next(new ApiError(400, 'Validation failed', extractedErrors));
  }
  next();
};

module.exports = {
  mongoIdParam,
  createTaskValidation,
  updateTaskValidation,
  updateStatusValidation,
  validate,
};
