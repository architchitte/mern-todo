const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    category: {
        type: String,
        trim: true,
        default: 'personal'
    },
    completed: { 
        type: Boolean, 
        default: false 
    },
    dueDate: {
        type: Date
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', null],
        default: null
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    parentTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: null
    },
    subtasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    attachments: [{
        type: String, // URLs to stored files
        trim: true
    }],
    assignedTo: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
});

// Update lastModified before saving
taskSchema.pre('save', function(next) {
    this.lastModified = new Date();
    next();
});

module.exports = mongoose.model("Task", taskSchema);
