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

    try {
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
