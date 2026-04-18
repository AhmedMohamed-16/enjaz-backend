/**
 * @file app.js
 * Express application setup and middleware configuration
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const config = require('./config/env');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const ApiResponse = require('./utils/ApiResponse');

const app = express();

// Global Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: config.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// Global Rate Limiting
app.use(limiter);

app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}




// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json(new ApiResponse(200, {
    status: 'ok',
    timestamp: new Date(),
  }, 'Health check passed'));
});

// Import Module Routers
const authRouter = require('./modules/auth/auth.routes');
const tasksRouter = require('./modules/tasks/task.routes');

// Auth specific rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // stricter for auth
});
app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/tasks', tasksRouter);

// Handle 404
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
