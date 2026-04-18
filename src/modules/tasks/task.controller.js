const taskService = require('./task.service');
const ApiResponse = require('../../utils/ApiResponse');

/**
 * Controller to fetch all tasks for a user with pagination and filters.
 */
const getAllTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.user._id, req.query);
    
    res.status(200).json(
      new ApiResponse(200, result, 'Tasks retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch a specific task by ID.
 */
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user._id);
    
    res.status(200).json(
      new ApiResponse(200, task, 'Task retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to create a new task.
 */
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user._id, req.body);
    
    res.status(201).json(
      new ApiResponse(201, task, 'Task created successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to perform a full update on a task.
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user._id, req.body);
    
    res.status(200).json(
      new ApiResponse(200, task, 'Task updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update only the status of a task.
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateTaskStatus(req.params.id, req.user._id, req.body.status);
    
    res.status(200).json(
      new ApiResponse(200, task, 'Status updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to soft delete a task.
 */
const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user._id);
    
    res.status(200).json(
      new ApiResponse(200, null, 'Task deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch task statistics for the user.
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await taskService.getTaskStats(req.user._id);
    
    res.status(200).json(
      new ApiResponse(200, stats, 'Task statistics retrieved')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getStats,
};
