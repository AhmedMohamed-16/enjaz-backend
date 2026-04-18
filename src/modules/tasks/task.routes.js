const express = require('express');
const { 
  getAllTasks, 
  getTask, 
  createTask, 
  updateTask, 
  updateTaskStatus, 
  deleteTask, 
  getStats 
} = require('./task.controller');
const { 
  mongoIdParam, 
  createTaskValidation, 
  updateTaskValidation, 
  updateStatusValidation, 
  validate 
} = require('./task.validator');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router();

/**
 * Apply authentication middleware to all task routes
 */
router.use(authenticate);

/**
 * @route GET /api/v1/tasks
 * @desc Get all tasks for authenticated user with filtering + pagination
 * @access Private
 */
router.get('/', getAllTasks);

/**
 * @route POST /api/v1/tasks
 * @desc Create a new task
 * @access Private
 */
router.post('/', createTaskValidation, validate, createTask);

/**
 * @route GET /api/v1/tasks/stats
 * @desc Get task status counts (todo, in_progress, done)
 * @access Private
 */
router.get('/stats', getStats);

/**
 * @route GET /api/v1/tasks/:id
 * @desc Get a single task by ID
 * @access Private
 */
router.get('/:id', mongoIdParam, validate, getTask);

/**
 * @route PUT /api/v1/tasks/:id
 * @desc Full update of a task
 * @access Private
 */
router.put('/:id', mongoIdParam, updateTaskValidation, validate, updateTask);

/**
 * @route PATCH /api/v1/tasks/:id/status
 * @desc Update only the status of a task
 * @access Private
 */
router.patch('/:id/status', mongoIdParam, updateStatusValidation, validate, updateTaskStatus);

/**
 * @route DELETE /api/v1/tasks/:id
 * @desc Soft delete a task
 * @access Private
 */
router.delete('/:id', mongoIdParam, validate, deleteTask);

module.exports = router;
