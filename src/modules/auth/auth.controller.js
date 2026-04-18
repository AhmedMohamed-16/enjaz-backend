const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../../utils/cookieUtils');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.registerUser({ name, email, password });
    
    res.status(201).json(
      new ApiResponse(201, { user }, "Account created successfully")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Log in a user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });
    
    setRefreshTokenCookie(res, refreshToken);
    
    res.status(200).json(
      new ApiResponse(200, { user, accessToken }, "Login successful")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Log out a user
 */
const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    
    clearRefreshTokenCookie(res);
    
    res.status(200).json(
      new ApiResponse(200, {}, "Logged out successfully")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
const refreshToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(incomingRefreshToken);
    
    setRefreshTokenCookie(res, newRefreshToken);
    
    res.status(200).json(
      new ApiResponse(200, { accessToken }, "Token refreshed")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    
    res.status(200).json(
      new ApiResponse(200, { user }, "User fetched")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
};
