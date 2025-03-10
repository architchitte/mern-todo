require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
    origin: "http://localhost:5173", // Vite's default port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Ensure MONGO_URI is properly loaded
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in .env file!");
    process.exit(1);
}

// Connect to MongoDB with improved error handling
mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

app.use(express.json());

// Task Schema & Model with validation
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

const Task = mongoose.model("Task", taskSchema);

// GET All Tasks
app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// POST (Add New Task)
app.post("/api/tasks", async (req, res) => {
    try {
        if (!req.body.title || !req.body.title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }
        
        const task = new Task({ title: req.body.title.trim() });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Failed to create task" });
    }
});

// PUT (Update Task Status)
app.put("/api/tasks/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { completed: req.body.completed },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ error: "Failed to update task" });
    }
});

// DELETE (Remove Task)
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const task = await Task.findByIdAndDelete(req.params.id);
        
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ error: "Failed to delete task" });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please try these steps:`);
        console.error('1. Kill the process using this port:');
        console.error('   Windows: netstat -ano | findstr :5000');
        console.error('   Then: taskkill /F /PID <PID>');
        console.error('2. Or use a different port by setting PORT in .env file');
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
    }
});
