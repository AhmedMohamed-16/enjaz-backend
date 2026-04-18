const authRepository = require('./auth.repository');
const ApiError = require('../../utils/ApiError');
const { generateTokenPair, verifyRefreshToken } = require('../../utils/tokenUtils');
const bcrypt = require('bcryptjs');

const registerUser = async ({ name, email, password }) => {
  // 1. Check if a user with this email already exists via repository
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    // 2. If exists -> throw ApiError with status 409
    throw new ApiError(409, 'Email already in use');
  }

  // 3. Create the user via repository (password hashing is in pre-save hook)
  const user = await authRepository.createUser({ name, email, password });
  
  // 4. Return the created user object (no password)
  return user;
};

const loginUser = async ({ email, password }) => {
  // 1. Find user by email WITH password via repository
  const user = await authRepository.findUserByEmailWithPassword(email);
  if (!user) {
    // 2. If not found -> throw ApiError 401 "Invalid credentials"
    throw new ApiError(401, 'Invalid credentials');
  }

  // 3. Call user.isPasswordCorrect(password)
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    // 4. If false -> throw ApiError 401 "Invalid credentials"
    throw new ApiError(401, 'Invalid credentials');
  }

  // 5. Generate token pair via generateTokenPair(user)
  const { accessToken, refreshToken } = generateTokenPair(user);

  // 6. Hash the refreshToken with bcrypt (saltRounds=10) before storing
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  // 7. Save hashed refresh token to DB via repository.updateRefreshToken()
  await authRepository.updateRefreshToken(user._id, hashedRefreshToken);

  // 8. Return: { user: { _id, name, email }, accessToken, refreshToken }
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    },
    accessToken,
    refreshToken
  };
};

const refreshAccessToken = async (incomingRefreshToken) => {
  // 1. If no token -> throw ApiError 401
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  // 2. Decode token using verifyRefreshToken()
  const decoded = verifyRefreshToken(incomingRefreshToken);

  // 3. Find user by ID WITH refreshToken via repository
  const user = await authRepository.findUserByIdWithRefreshToken(decoded._id);
  
  // 4. If not found -> throw ApiError 401 "Invalid refresh token"
  if (!user || !user.refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  // 5. Compare incomingRefreshToken with stored hash using bcrypt.compare()
  const isMatch = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
  
  // 6. If mismatch -> clear the stored token then throw ApiError 401 "Refresh token mismatch"
  if (!isMatch) {
    await authRepository.clearRefreshToken(user._id);
    throw new ApiError(401, 'Refresh token mismatch');
  }

  // 7. Generate new token pair (token rotation)
  const { accessToken, refreshToken } = generateTokenPair(user);

  // 8. Hash new refresh token and update in DB
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await authRepository.updateRefreshToken(user._id, hashedRefreshToken);

  // 9. Return: { accessToken, refreshToken }
  return { accessToken, refreshToken };
};

const logoutUser = async (userId) => {
  // 1. Clear the refresh token in DB via repository.clearRefreshToken()
  await authRepository.clearRefreshToken(userId);
};

const getCurrentUser = async (userId) => {
  // 1. Find user by ID via repository
  const user = await authRepository.findUserById(userId);
  
  // 2. If not found -> throw ApiError 404
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  // 3. Return user object
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser
};
