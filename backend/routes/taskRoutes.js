const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Get all tasks
router.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Create task
router.post("/tasks", async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

// Update task
router.put("/tasks/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

// Delete task
router.delete("/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

module.exports = router;
