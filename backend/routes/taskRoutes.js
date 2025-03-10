const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
router.post("/", async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.title) {
            return res.status(400).json({ message: "Title is required" });
        }

        // Validate priority if provided
        if (req.body.priority && !['high', 'medium', 'low'].includes(req.body.priority)) {
            return res.status(400).json({ message: "Invalid priority value" });
        }

        // Validate recurring pattern if provided
        if (req.body.isRecurring && !['daily', 'weekly', 'monthly'].includes(req.body.recurringPattern)) {
            return res.status(400).json({ message: "Invalid recurring pattern" });
        }

        // Validate progress if provided
        if (req.body.progress !== undefined) {
            const progress = Number(req.body.progress);
            if (isNaN(progress) || progress < 0 || progress > 100 || !Number.isInteger(progress)) {
                return res.status(400).json({ message: "Progress must be an integer between 0 and 100" });
            }
        }

        // Validate due date if provided
        if (req.body.dueDate && new Date(req.body.dueDate) < new Date()) {
            return res.status(400).json({ message: "Due date cannot be in the past" });
        }

        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            category: req.body.category,
            dueDate: req.body.dueDate,
            isRecurring: req.body.isRecurring,
            recurringPattern: req.body.recurringPattern,
            progress: req.body.progress || 0,
            assignedTo: req.body.assignedTo,
            attachments: req.body.attachments || [],
        });

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a task
router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Validate priority if provided
        if (req.body.priority && !['high', 'medium', 'low'].includes(req.body.priority)) {
            return res.status(400).json({ message: "Invalid priority value" });
        }

        // Validate recurring pattern if provided
        if (req.body.isRecurring && !['daily', 'weekly', 'monthly'].includes(req.body.recurringPattern)) {
            return res.status(400).json({ message: "Invalid recurring pattern" });
        }

        // Validate progress if provided
        if (req.body.progress !== undefined) {
            const progress = Number(req.body.progress);
            if (isNaN(progress) || progress < 0 || progress > 100 || !Number.isInteger(progress)) {
                return res.status(400).json({ message: "Progress must be an integer between 0 and 100" });
            }
        }

        // Validate due date if provided
        if (req.body.dueDate && new Date(req.body.dueDate) < new Date()) {
            return res.status(400).json({ message: "Due date cannot be in the past" });
        }

        // Update only the fields that are provided
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                task[key] = req.body[key];
            }
        });

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
