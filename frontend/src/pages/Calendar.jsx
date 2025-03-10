import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/tasks";
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks. Please try again.");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  const getYear = (date) => {
    return date.getFullYear();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const dayTasks = getTasksForDate(date);

      days.push(
        <div
          key={day}
          className={`h-24 border p-2 cursor-pointer hover:bg-[#334155] transition-colors duration-200 ${
            isSelected ? 'bg-indigo-500/20 border-indigo-500' : 'border-[#334155]'
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm font-medium text-gray-100">{day}</div>
          {dayTasks.length > 0 && (
            <div className="mt-1">
              {dayTasks.map(task => (
                <div
                  key={task._id}
                  className={`text-xs px-1 py-0.5 rounded ${
                    task.priority === 'high'
                      ? 'bg-red-500/20 text-red-300'
                      : task.priority === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}
                >
                  {task.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Calendar</h1>
          <p className="mt-2 text-sm text-gray-300">
            View and manage your tasks in a calendar view.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={previousMonth}
                  className="p-2 rounded-full hover:bg-[#334155] transition-colors duration-200"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-300" />
                </button>
                <h2 className="text-lg font-semibold text-gray-100">
                  {getMonthName(currentDate)} {getYear(currentDate)}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-full hover:bg-[#334155] transition-colors duration-200"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-300" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-[#334155]">
              {days.map((day) => (
                <div
                  key={day}
                  className="bg-[#1E293B] py-2 text-center text-sm font-semibold text-gray-300"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-[#334155]">
              {renderCalendarDays()}
            </div>
          </div>

          <div className="card p-6 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
            <h3 className="text-lg font-semibold text-gray-100 mb-6">
              {selectedDate ? `Tasks for ${selectedDate.toLocaleDateString()}` : 'Select a date'}
            </h3>
            <div className="space-y-4">
              {selectedDate && getTasksForDate(selectedDate).length > 0 ? (
                getTasksForDate(selectedDate).map(task => (
                  <div
                    key={task._id}
                    className="p-4 rounded-lg bg-[#1E293B] hover:bg-[#334155] transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-100">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                        )}
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-500/20 text-red-300'
                          : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No tasks scheduled for this date.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 