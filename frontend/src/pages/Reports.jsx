import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const API_URL = "http://localhost:5000/api/tasks";

export default function Reports() {
  const [tasks, setTasks] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate && taskDate <= now;
    });

    const completedTasks = filteredTasks.filter(task => task.completed);
    const pendingTasks = filteredTasks.filter(task => !task.completed);
    const overdueTasks = filteredTasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    );

    return {
      total: filteredTasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      overdue: overdueTasks.length,
      completionRate: filteredTasks.length > 0 
        ? (completedTasks.length / filteredTasks.length) * 100 
        : 0,
    };
  };

  const stats = calculateStats();

  const priorityDistribution = () => {
    const distribution = {
      high: 0,
      medium: 0,
      low: 0,
    };

    tasks.forEach(task => {
      distribution[task.priority]++;
    });

    return distribution;
  };

  const categoryDistribution = () => {
    const distribution = {
      personal: 0,
      work: 0,
      shopping: 0,
      fitness: 0,
    };

    tasks.forEach(task => {
      distribution[task.category]++;
    });

    return distribution;
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="mt-2 text-sm text-gray-700">
            View analytics and insights about your tasks.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Task Overview</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input w-48"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.overdue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Priority Distribution</h3>
            <div className="space-y-4">
              {Object.entries(priorityDistribution()).map(([priority, count]) => (
                <div key={priority}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 capitalize">{priority}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        priority === 'high'
                          ? 'bg-red-500'
                          : priority === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${(count / tasks.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
            <div className="space-y-4">
              {Object.entries(categoryDistribution()).map(([category, count]) => (
                <div key={category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900 capitalize">{category}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{
                        width: `${(count / tasks.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 