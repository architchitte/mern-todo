import { useState } from 'react';
import { UserIcon, BellIcon, LockClosedIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    emailUpdates: true,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-100">Settings</h1>
        <p className="mt-2 text-sm text-gray-300">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-[#1E293B] rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Profile Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-100 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                Profile Settings
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 input"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 input"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-100 flex items-center">
                <BellIcon className="h-5 w-5 mr-2 text-gray-400" />
                Notifications
              </h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="notifications" className="text-sm font-medium text-gray-300">
                      Push Notifications
                    </label>
                    <p className="text-sm text-gray-400">Receive notifications for task updates</p>
                  </div>
                  <button
                    type="button"
                    className={`${
                      settings.notifications ? 'bg-indigo-600' : 'bg-gray-700'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                  >
                    <span
                      className={`${
                        settings.notifications ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="emailUpdates" className="text-sm font-medium text-gray-300">
                      Email Updates
                    </label>
                    <p className="text-sm text-gray-400">Receive email notifications for important updates</p>
                  </div>
                  <button
                    type="button"
                    className={`${
                      settings.emailUpdates ? 'bg-indigo-600' : 'bg-gray-700'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    onClick={() => setSettings(prev => ({ ...prev, emailUpdates: !prev.emailUpdates }))}
                  >
                    <span
                      className={`${
                        settings.emailUpdates ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-100 flex items-center">
                <MoonIcon className="h-5 w-5 mr-2 text-gray-400" />
                Appearance
              </h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="darkMode" className="text-sm font-medium text-gray-300">
                      Dark Mode
                    </label>
                    <p className="text-sm text-gray-400">Toggle dark/light theme</p>
                  </div>
                  <button
                    type="button"
                    className={`${
                      settings.darkMode ? 'bg-indigo-600' : 'bg-gray-700'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                  >
                    <span
                      className={`${
                        settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-100 flex items-center">
                <LockClosedIcon className="h-5 w-5 mr-2 text-gray-400" />
                Security
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="mt-1 input"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="mt-1 input"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="mt-1 input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-[#334155] rounded-b-lg flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-[#475569] rounded-md hover:bg-[#64748B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 