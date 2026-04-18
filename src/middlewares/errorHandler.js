/**
 * @file errorHandler.js
 * Global error handling middleware
 */

const ApiError = require('../utils/ApiError');
const config = require('../config/env');

/**
 * Express global error handling middleware
 * @param {Error} err - The error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Handle specific Mongoose errors
  if (err.name === 'CastError') {
    error = ApiError.badRequest('Invalid ID format');
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, 'Validation Error', messages);
  }

  if (err.code === 11000) {
    error = new ApiError(409, 'Duplicate field value entered');
  }

  // Handle specific JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  }

  const isDevelopment = config.NODE_ENV === 'development';
  
  // Do not leak error details in production
  if (!isDevelopment && error.statusCode === 500) {
    error.message = 'Internal Server Error';
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(isDevelopment && { stack: error.stack })
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
