/**
 * @file authenticate.js
 * Middleware to protect routes with JWT access token
 */

const User = require('../modules/auth/user.model');
const { verifyAccessToken } = require('../utils/tokenUtils');
const ApiError = require('../utils/ApiError');

// Handle ESM default exports if the model was transpiled/loaded via ESM
const UserModel = User.default || User;

/**
 * JWT guard middleware
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    const decodedToken = verifyAccessToken(token);

    const user = await UserModel.findById(decodedToken._id).select('-password -refreshToken');

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (user.isActive === false) {
      throw ApiError.forbidden('Account disabled');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
