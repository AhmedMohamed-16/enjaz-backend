/**
 * @file ApiError.js
 * Custom error class for API responses
 */

class ApiError extends Error {
  /**
   * Creates an instance of ApiError.
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error description
   * @param {Array} [errors=[]] - Optional array of specific validation errors
   * @param {string} [stack=''] - Optional stack trace
   */
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * @param {string} [msg='Bad Request'] 
   * @returns {ApiError}
   */
  static badRequest(msg = 'Bad Request') {
    return new ApiError(400, msg);
  }

  /**
   * @param {string} [msg='Unauthorized'] 
   * @returns {ApiError}
   */
  static unauthorized(msg = 'Unauthorized') {
    return new ApiError(401, msg);
  }

  /**
   * @param {string} [msg='Forbidden'] 
   * @returns {ApiError}
   */
  static forbidden(msg = 'Forbidden') {
    return new ApiError(403, msg);
  }

  /**
   * @param {string} [msg='Not Found'] 
   * @returns {ApiError}
   */
  static notFound(msg = 'Not Found') {
    return new ApiError(404, msg);
  }

  /**
   * @param {string} [msg='Internal Server Error'] 
   * @returns {ApiError}
   */
  static internal(msg = 'Internal Server Error') {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;
