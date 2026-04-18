const User = require('./user.model');

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select('+password');
};

const findUserById = async (id) => {
  return User.findById(id);
};

const createUser = async ({ name, email, password }) => {
  const user = new User({ name, email, password });
  return user.save();
};

const updateRefreshToken = async (userId, refreshToken) => {
  return User.findByIdAndUpdate(
    userId,
    { refreshToken },
    { new: true }
  );
};

const clearRefreshToken = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    { refreshToken: null },
    { new: true }
  );
};

const findUserByIdWithRefreshToken = async (userId) => {
  return User.findById(userId).select('+refreshToken');
};

module.exports = {
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  createUser,
  updateRefreshToken,
  clearRefreshToken,
  findUserByIdWithRefreshToken,
};
