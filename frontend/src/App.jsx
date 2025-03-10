import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get(API_URL);
            setTasks(res.data);
        } catch (err) {
            setError("Failed to fetch tasks. Please try again.");
            console.error("❌ Error fetching tasks:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const addTask = async () => {
        if (!title.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.post(API_URL, { title });
            setTasks([...tasks, res.data]);
            setTitle("");
        } catch (err) {
            setError("Failed to add task. Please try again.");
            console.error("❌ Error adding task:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTask = async (id, completed) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.put(`${API_URL}/${id}`, { completed: !completed });
            setTasks(tasks.map(task => (task._id === id ? res.data : task)));
        } catch (err) {
            setError("Failed to update task. Please try again.");
            console.error("❌ Error updating task:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTask = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (err) {
            setError("Failed to delete task. Please try again.");
            console.error("❌ Error deleting task:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    return (
        <div className="app-container">
            <div className="app-content">
                <header className="app-header">
                    <h1>Tasks</h1>
                    <p className="subtitle">Manage your daily tasks</p>
                </header>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="input-container">
                    <input
                        type="text"
                        className="task-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a new task..."
                        disabled={isLoading}
                    />
                    <button 
                        onClick={addTask} 
                        className={`add-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        <FaPlus />
                    </button>
                </div>

                {isLoading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                    </div>
                )}

                <div className="tasks-container">
                    {tasks.map(task => (
                        <div 
                            key={task._id || task.id} 
                            className={`task-item ${task.completed ? 'completed' : ''}`}
                        >
                            <label className="task-label">
                                <input 
                                    type="checkbox" 
                                    checked={task.completed} 
                                    onChange={() => toggleTask(task._id, task.completed)} 
                                    className="task-checkbox"
                                    disabled={isLoading}
                                />
                                <span className="task-title">{task.title}</span>
                            </label>
                            <button 
                                onClick={() => deleteTask(task._id)} 
                                className="delete-button"
                                disabled={isLoading}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
