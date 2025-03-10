import { useState, useEffect } from "react";
import axios from "axios";
import { 
    FaTrash, 
    FaPlus, 
    FaCalendarAlt, 
    FaTag, 
    FaExclamationCircle,
    FaCheckCircle,
    FaClock,
    FaPaperclip,
    FaUser,
    FaListUl,
    FaRegClock,
    FaRegCalendarCheck
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("personal");
    const [dueDate, setDueDate] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringPattern, setRecurringPattern] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState("list"); // list, calendar, timeline
    const [sortBy, setSortBy] = useState("createdAt"); // createdAt, dueDate, priority
    const [filter, setFilter] = useState("all"); // all, active, completed
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isDarkMode, setIsDarkMode] = useState(false);

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
            const taskData = {
                title: title.trim(),
                description: description.trim(),
                priority,
                category,
                dueDate: dueDate || null,
                isRecurring,
                recurringPattern,
                progress: 0
            };
            const res = await axios.post(API_URL, taskData);
            setTasks([...tasks, res.data]);
            resetForm();
        } catch (err) {
            setError("Failed to add task. Please try again.");
            console.error("❌ Error adding task:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setCategory("personal");
        setDueDate("");
        setIsRecurring(false);
        setRecurringPattern(null);
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

    const updateTaskProgress = async (id, progress) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.put(`${API_URL}/${id}`, { progress });
            setTasks(tasks.map(task => (task._id === id ? res.data : task)));
        } catch (err) {
            setError("Failed to update task progress. Please try again.");
            console.error("❌ Error updating task progress:", err);
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ff4444';
            case 'medium': return '#ffbb33';
            case 'low': return '#00C851';
            default: return '#54698d';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'work': return '#0070d2';
            case 'personal': return '#ff9e2b';
            case 'shopping': return '#4bca81';
            case 'fitness': return '#0070d2';
            default: return '#54698d';
        }
    };

    const filteredTasks = tasks
        .filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        })
        .filter(task => {
            if (selectedCategory === 'all') return true;
            return task.category === selectedCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'dueDate':
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'priority':
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="app-content">
                <header className="app-header">
                    <h1>Tasks</h1>
                    <p className="subtitle">Manage your daily tasks</p>
                    <button 
                        className="theme-toggle"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </header>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="task-form">
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

                    <div className="task-details">
                        <textarea
                            className="task-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add description..."
                        />
                        
                        <div className="task-options">
                            <select 
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="task-select"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>

                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="task-select"
                            >
                                <option value="personal">Personal</option>
                                <option value="work">Work</option>
                                <option value="shopping">Shopping</option>
                                <option value="fitness">Fitness</option>
                            </select>

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="task-date"
                            />

                            <div className="recurring-options">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={isRecurring}
                                        onChange={(e) => setIsRecurring(e.target.checked)}
                                    />
                                    Recurring
                                </label>
                                {isRecurring && (
                                    <select
                                        value={recurringPattern}
                                        onChange={(e) => setRecurringPattern(e.target.value)}
                                        className="task-select"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="task-controls">
                    <div className="view-options">
                        <button 
                            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <FaListUl /> List
                        </button>
                        <button 
                            className={`view-button ${viewMode === 'calendar' ? 'active' : ''}`}
                            onClick={() => setViewMode('calendar')}
                        >
                            <FaCalendarAlt /> Calendar
                        </button>
                        <button 
                            className={`view-button ${viewMode === 'timeline' ? 'active' : ''}`}
                            onClick={() => setViewMode('timeline')}
                        >
                            <FaRegClock /> Timeline
                        </button>
                    </div>

                    <div className="filter-options">
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Tasks</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="createdAt">Date Created</option>
                            <option value="dueDate">Due Date</option>
                            <option value="priority">Priority</option>
                        </select>

                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="shopping">Shopping</option>
                            <option value="fitness">Fitness</option>
                        </select>
                    </div>
                </div>

                {isLoading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                    </div>
                )}

                <div className="tasks-container">
                    {filteredTasks.map(task => (
                        <div 
                            key={task._id || task.id} 
                            className={`task-item ${task.completed ? 'completed' : ''}`}
                            style={{
                                borderLeftColor: getPriorityColor(task.priority),
                                borderTopColor: getCategoryColor(task.category)
                            }}
                        >
                            <div className="task-main">
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
                                <div className="task-actions">
                                    <button 
                                        onClick={() => deleteTask(task._id)} 
                                        className="delete-button"
                                        disabled={isLoading}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            {task.description && (
                                <p className="task-description">{task.description}</p>
                            )}

                            <div className="task-meta">
                                <div className="task-tags">
                                    <span className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                                        <FaExclamationCircle /> {task.priority}
                                    </span>
                                    <span className="task-category" style={{ backgroundColor: getCategoryColor(task.category) }}>
                                        <FaTag /> {task.category}
                                    </span>
                                </div>

                                <div className="task-info">
                                    {task.dueDate && (
                                        <span className="task-due">
                                            <FaRegCalendarCheck /> {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                    {task.isRecurring && (
                                        <span className="task-recurring">
                                            <FaClock /> {task.recurringPattern}
                                        </span>
                                    )}
                                    {task.assignedTo && (
                                        <span className="task-assigned">
                                            <FaUser /> {task.assignedTo}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="task-progress">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ width: `${task.progress}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">{task.progress}%</span>
                            </div>

                            {task.attachments && task.attachments.length > 0 && (
                                <div className="task-attachments">
                                    {task.attachments.map((attachment, index) => (
                                        <a 
                                            key={index}
                                            href={attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="attachment-link"
                                        >
                                            <FaPaperclip /> Attachment {index + 1}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
