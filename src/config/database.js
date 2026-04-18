/**
 * @file database.js
 * MongoDB connection logic via Mongoose
 */

const mongoose = require('mongoose');
const config = require('./env');

/**
 * Connects to the MongoDB database using the environment URI
 * @returns {Promise<mongoose.Connection>} Resolves when connected
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`[Error] MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
