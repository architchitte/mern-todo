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
        enum: {
            values: ['high', 'medium', 'low'],
            message: '{VALUE} is not a valid priority'
        },
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
        type: Date,
        validate: {
            validator: function(value) {
                return !value || value >= new Date();
            },
            message: 'Due date cannot be in the past'
        }
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPattern: {
        type: String,
        enum: {
            values: ['daily', 'weekly', 'monthly', null],
            message: '{VALUE} is not a valid recurring pattern'
        },
        default: null,
        validate: {
            validator: function(value) {
                return !this.isRecurring || value !== null;
            },
            message: 'Recurring pattern is required when isRecurring is true'
        }
    },
    progress: {
        type: Number,
        min: [0, 'Progress cannot be less than 0'],
        max: [100, 'Progress cannot be more than 100'],
        default: 0,
        validate: {
            validator: function(value) {
                return Number.isInteger(value);
            },
            message: 'Progress must be an integer'
        }
    },
    parentTask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        default: null,
        validate: {
            validator: function(value) {
                return value !== this._id;
            },
            message: 'Task cannot be its own parent'
        }
    },
    subtasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    attachments: [{
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                return /^https?:\/\/.+/.test(value);
            },
            message: 'Attachment must be a valid URL'
        }
    }],
    assignedTo: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
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
