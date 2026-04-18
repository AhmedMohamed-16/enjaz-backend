const Task = require('./task.model');
const mongoose = require('mongoose');

// Handle ESM default exports if the model was loaded via require
const TaskModel = Task.default || Task;

/**
 * Finds all tasks for a specific owner with advanced filtering and pagination.
 * 
 * @param {string} userId - ID of the task owner
 * @param {Object} filters - { status, priority, search }
 * @param {Object} options - { page, limit, sortBy, sortOrder }
 * @returns {Promise<Object>} { tasks, totalCount, page, totalPages }
 */
const findTasksByOwner = async (userId, filters = {}, options = {}) => {
  const { status, priority, search } = filters;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;

  const query = { owner: userId };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [tasks, totalCount] = await Promise.all([
    TaskModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit),
    TaskModel.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    tasks,
    totalCount,
    page: Number(page),
    totalPages
  };
};

/**
 * Finds a task document by ID.
 * 
 * @param {string} taskId - ID of the task
 * @returns {Promise<Object|null>}
 */
const findTaskById = async (taskId) => {
  return await TaskModel.findById(taskId);
};

/**
 * Creates and saves a new Task document.
 * 
 * @param {Object} data - Task data including owner field
 * @returns {Promise<Object>}
 */
const createTask = async (data) => {
  const task = new TaskModel(data);
  return await task.save();
};

/**
 * Updates a task document.
 * 
 * @param {string} taskId - ID of the task
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>}
 */
const updateTask = async (taskId, updateData) => {
  return await TaskModel.findByIdAndUpdate(
    taskId,
    updateData,
    { new: true, runValidators: true }
  );
};

/**
 * Soft deletes a task by setting isDeleted to true.
 * 
 * @param {string} taskId - ID of the task
 * @returns {Promise<Object|null>}
 */
const softDeleteTask = async (taskId) => {
  return await TaskModel.findByIdAndUpdate(
    taskId,
    { isDeleted: true },
    { new: true }
  );
};

/**
 * Returns aggregate counts grouped by status for a given user.
 * 
 * @param {string} userId - ID of the owner
 * @returns {Promise<Object>} { todo, in_progress, done }
 */
const countTasksByStatus = async (userId) => {
  const stats = await TaskModel.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Format into a more readable object
  const formattedStats = { todo: 0, in_progress: 0, done: 0 };
  stats.forEach(stat => {
    formattedStats[stat._id] = stat.count;
  });

  return formattedStats;
};

module.exports = {
  findTasksByOwner,
  findTaskById,
  createTask,
  updateTask,
  softDeleteTask,
  countTasksByStatus
};
