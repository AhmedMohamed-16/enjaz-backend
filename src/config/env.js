/**
 * @file env.js
 * Environment variable validation and configuration export
 */

const requiredEnvVars = [
  'PORT',
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'CLIENT_URL',
];

const env = {};

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`[Error] Missing required environment variable: ${varName}`);
    process.exit(1);
  }
  env[varName] = process.env[varName];
}

env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Validated and frozen environment configuration
 * @type {Readonly<Object>}
 */
const config = Object.freeze(env);

module.exports = config;
