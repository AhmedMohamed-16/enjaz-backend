const taskRepository = require('./task.repository');
const ApiError = require('../../utils/ApiError');

/**
 * Utility to verify task ownership.
 * 
 * @param {Object} task - Task document
 * @param {string} userId - ID of the current user
 * @throws {ApiError} 403 if ownership fails
 */
const verifyOwnership = (task, userId) => {
  if (task.owner.toString() !== userId.toString()) {
    throw ApiError.forbidden('Access denied');
  }
};

/**
 * Retrieves a paginated list of tasks for a user with filtering and search.
 * 
 * @param {string} userId - Current user ID
 * @param {Object} query - Query parameters from request
 * @returns {Promise<Object>} Paginated task list
 */
const getTasks = async (userId, query) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    priority, 
    search, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = query;

  // Pagination validation
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit)));

  const filters = { status, priority, search };
  const options = { 
    page: parsedPage, 
    limit: parsedLimit, 
    sortBy, 
    sortOrder 
  };

  return await taskRepository.findTasksByOwner(userId, filters, options);
};

/**
 * Fetches a single task with ownership verification.
 * 
 * @param {string} taskId - ID of the task
 * @param {string} userId - Current user ID
 * @returns {Promise<Object>}
 */
const getTaskById = async (taskId, userId) => {
  const task = await taskRepository.findTaskById(taskId);
  
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  verifyOwnership(task, userId);
  return task;
};

/**
 * Business logic to create a new task.
 * 
 * @param {string} userId - Current user ID
 * @param {Object} taskData - Data for the new task
 * @returns {Promise<Object>}
 */
const createTask = async (userId, { title, description, status, priority, dueDate }) => {
  // Validate dueDate if provided
  if (dueDate) {
    const selectedDate = new Date(dueDate);
    if (selectedDate <= new Date()) {
      throw ApiError.badRequest('Due date must be a future date');
    }
  }

  return await taskRepository.createTask({
    title,
    description,
    status,
    priority,
    dueDate,
    owner: userId
  });
};

/**
 * Updates an existing task with ownership and protection checks.
 * 
 * @param {string} taskId - ID of the task
 * @param {string} userId - Current user ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
const updateTask = async (taskId, userId, updateData) => {
  const task = await getTaskById(taskId, userId); // Includes existence and ownership check

  // Guard against protected fields
  const protectedFields = ['owner', 'isDeleted', '_id'];
  protectedFields.forEach(field => delete updateData[field]);

  // Validate dueDate if provided
  if (updateData.dueDate) {
    const selectedDate = new Date(updateData.dueDate);
    if (selectedDate <= new Date()) {
      throw ApiError.badRequest('Due date must be a future date');
    }
  }

  return await taskRepository.updateTask(taskId, updateData);
};

/**
 * Updates only the status field of a task.
 * 
 * @param {string} taskId - ID of the task
 * @param {string} userId - Current user ID
 * @param {string} newStatus - New status value
 * @returns {Promise<Object>}
 */
const updateTaskStatus = async (taskId, userId, newStatus) => {
  const task = await getTaskById(taskId, userId); // Includes existence and ownership check

  // Enum validation is handled by express-validator but reinforced here
  const validStatuses = ['todo', 'in_progress', 'done'];
  if (!validStatuses.includes(newStatus)) {
    throw ApiError.badRequest('Invalid status value');
  }

  return await taskRepository.updateTask(taskId, { status: newStatus });
};

/**
 * Soft deletes a task.
 * 
 * @param {string} taskId - ID of the task
 * @param {string} userId - Current user ID
 * @returns {Promise<Object>}
 */
const deleteTask = async (taskId, userId) => {
  await getTaskById(taskId, userId); // Includes existence and ownership check
  return await taskRepository.softDeleteTask(taskId);
};

/**
 * Fetches task statistics for the user dashboard.
 * 
 * @param {string} userId - Current user ID
 * @returns {Promise<Object>}
 */
const getTaskStats = async (userId) => {
  return await taskRepository.countTasksByStatus(userId);
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
};
