/**
 * @file notFound.js
 * 404 handler for unmatched routes
 */

const ApiError = require('../utils/ApiError');

/**
 * Middleware to handle 404 errors when no route is matched
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const notFound = (req, res, next) => {
  next(ApiError.notFound(`Not Found - ${req.originalUrl}`));
};

module.exports = notFound;
