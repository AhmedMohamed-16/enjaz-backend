const express = require('express');
const { register, login, logout, refreshToken, getMe } = require('./auth.controller');
const { registerValidation, loginValidation, validate } = require('./auth.validator');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', registerValidation, validate, register);

/**
 * @route POST /api/v1/auth/login
 * @desc Log in a user
 * @access Public
 */
router.post('/login', loginValidation, validate, login);

/**
 * @route POST /api/v1/auth/logout
 * @desc Log out a user
 * @access Protected
 */
router.post('/logout', authenticate, logout);

/**
 * @route POST /api/v1/auth/refresh-token
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh-token', refreshToken);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user
 * @access Protected
 */
router.get('/me', authenticate, getMe);

module.exports = router;
