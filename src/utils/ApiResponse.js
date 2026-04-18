/**
 * @file ApiResponse.js
 * Standardized successful API response wrapper
 */

class ApiResponse {
  /**
   * Creates an ApiResponse instance.
   * @param {number} statusCode - HTTP status code
   * @param {any} data - The payload to send
   * @param {string} [message='Success'] - Descriptive success message
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = ApiResponse;
