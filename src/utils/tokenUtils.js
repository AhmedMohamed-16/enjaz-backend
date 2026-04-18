/**
 * @file tokenUtils.js
 * JWT generation and verification utilities
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('./ApiError');

/**
 * Generates an access token and a refresh token for the given user.
 * 
 * @param {Object} user - The user instance
 * @returns {Object} Object containing accessToken and refreshToken
 */
const generateTokenPair = (user) => {
  const accessToken = user.generateAccessToken(
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRES_IN
  );
  
  const refreshToken = user.generateRefreshToken(
    config.JWT_REFRESH_SECRET,
    config.JWT_REFRESH_EXPIRES_IN
  );

  return { accessToken, refreshToken };
};

/**
 * Verifies an access token
 * 
 * @param {string} token - The access token
 * @returns {Object} Decoded payload
 * @throws {ApiError} If token is invalid or expired
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_ACCESS_SECRET);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired access token');
  }
};

/**
 * Verifies a refresh token
 * 
 * @param {string} token - The refresh token
 * @returns {Object} Decoded payload
 * @throws {ApiError} If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET);
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
};

module.exports = {
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken
};
