/**
 * @file server.js
 * Entry point for the server
 */

require('dotenv').config();

const config = require('./src/config/env');
const connectDB = require('./src/config/database');
const app = require('./src/app');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Error] Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

// Setup the server start function
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.PORT, () => {
      console.log(`Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Error] Unhandled Rejection: ${err.message}`);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
