const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Mongoose schema for the User model.
 * 
 * @typedef {Object} User
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  refreshToken: {
    type: String,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    }
  }
});

// Index on email is automatically created by unique: true in the field definition.

// Pre-save hook: Hash the password before saving if it has been modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compares a candidate password with the user's hashed password.
 * 
 * @param {string} candidatePassword - The plain text password to check.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generates a signed Access Token for the user.
 * 
 * @param {string} secret - JWT access secret provided via call context.
 * @param {string|number} expiresIn - JWT access token expiration.
 * @returns {string} The signed JWT access token.
 */
userSchema.methods.generateAccessToken = function (secret, expiresIn) {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    secret,
    { expiresIn }
  );
};

/**
 * Generates a signed Refresh Token for the user.
 * 
 * @param {string} secret - JWT refresh secret provided via call context.
 * @param {string|number} expiresIn - JWT refresh token expiration.
 * @returns {string} The signed JWT refresh token.
 */
userSchema.methods.generateRefreshToken = function (secret, expiresIn) {
  return jwt.sign(
    { _id: this._id },
    secret,
    { expiresIn }
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
