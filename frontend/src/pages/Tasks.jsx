import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  TagIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const API_URL = "http://localhost:5000/api/tasks";

export default function Tasks() {
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
  const [filter, setFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

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
      console.error("Error fetching tasks:", err);
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
      console.error("Error adding task:", err);
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
      console.error("Error updating task:", err);
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
      console.error("Error deleting task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
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
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Tasks</h1>
          <p className="mt-2 text-sm text-gray-300">
            Manage your tasks and track their progress.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="card">
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                disabled={isLoading}
              />
              <button
                onClick={addTask}
                disabled={isLoading}
                className="btn btn-primary flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Add Task
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="all">All Categories</option>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="shopping">Shopping</option>
                <option value="fitness">Fitness</option>
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700">
                  Recurring Task
                </label>
              </div>
            </div>

            {isRecurring && (
              <select
                value={recurringPattern}
                onChange={(e) => setRecurringPattern(e.target.value)}
                className="input"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}

            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <li key={task._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id, task.completed)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <p className={`text-sm font-medium ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {task.category}
                      </span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 