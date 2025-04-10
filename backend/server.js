require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require('./routes/authRoutes');

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

// Routes
app.use("/api/tasks", taskRoutes);
app.use('/api/auth', authRoutes);

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
