import mongoose from 'mongoose';

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

/**
 * Mongoose schema for the Task model.
 * 
 * @typedef {Object} Task
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 150
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  status: {
    type: String,
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.TODO
  },
  priority: {
    type: String,
    enum: Object.values(TASK_PRIORITY),
    default: TASK_PRIORITY.MEDIUM
  },
  dueDate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Indexes to optimize common queries
taskSchema.index({ owner: 1, isDeleted: 1, createdAt: -1 });
taskSchema.index({ owner: 1, status: 1 });

/**
 * Virtual property to check if a task is overdue.
 * Returns true if dueDate exists, is in the past, and status is not 'done'.
 */
taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate) return false;
  if (this.status === TASK_STATUS.DONE) return false;
  return this.dueDate < new Date();
});

// Middleware to exclude soft-deleted tasks from find queries by default
const excludeDeletedPlugin = function (next) {
  if (this.getQuery().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
};

taskSchema.pre('find', excludeDeletedPlugin);
taskSchema.pre('findOne', excludeDeletedPlugin);
taskSchema.pre('findOneAndUpdate', excludeDeletedPlugin);
taskSchema.pre('countDocuments', excludeDeletedPlugin);

const Task = mongoose.model('Task', taskSchema);

export default Task;
