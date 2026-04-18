/**
 * @file cookieUtils.js
 * Utilities for managing cookies
 */

const config = require('../config/env');

/**
 * Sets a secure httpOnly cookie containing the refresh token.
 * 
 * @param {Object} res - Express response object
 * @param {string} token - The refresh token
 */
const setRefreshTokenCookie = (res, token) => {
  // 7 days in milliseconds
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: maxAge,
    path: '/api/v1/auth'
  });
};

/**
 * Clears the refresh token cookie.
 * 
 * @param {Object} res - Express response object
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth'
  });
};

module.exports = {
  setRefreshTokenCookie,
  clearRefreshTokenCookie
};
