import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

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

      days.push(
        <div
          key={day}
          className={`h-24 border p-2 cursor-pointer hover:bg-gray-50 ${
            isSelected ? 'bg-primary-50 border-primary-500' : 'border-gray-200'
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="text-sm font-medium text-gray-900">{day}</div>
          {/* Add task indicators here */}
        </div>
      );
    }

    return days;
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your tasks in a calendar view.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={previousMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {getMonthName(currentDate)} {getYear(currentDate)}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {days.map((day) => (
              <div
                key={day}
                className="bg-white py-2 text-center text-sm font-semibold text-gray-900"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="card">
            <p className="text-sm text-gray-500">No tasks scheduled for this date.</p>
          </div>
        </div>
      )}
    </div>
  );
} 