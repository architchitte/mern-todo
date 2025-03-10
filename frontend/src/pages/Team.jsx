import { useState } from 'react';
import {
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const team = [
  {
    name: 'John Doe',
    role: 'Project Manager',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
  },
  {
    name: 'Jane Smith',
    role: 'Developer',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'jane@example.com',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
  },
  {
    name: 'Mike Johnson',
    role: 'Designer',
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'mike@example.com',
    phone: '+1 (555) 345-6789',
    department: 'Design',
  },
  {
    name: 'Sarah Wilson',
    role: 'Product Manager',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    email: 'sarah@example.com',
    phone: '+1 (555) 456-7890',
    department: 'Product',
  },
];

export default function Team() {
  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Team</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all team members and their roles.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowAddMember(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <UserPlusIcon className="h-5 w-5" />
            Add Member
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((person) => (
          <div key={person.name} className="card">
            <div className="flex items-center gap-x-4">
              <img className="h-12 w-12 rounded-full" src={person.imageUrl} alt="" />
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">{person.name}</h3>
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">{person.role}</p>
                </div>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-x-2">
                <dt className="flex-none text-sm text-gray-500">
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
                </dt>
                <dd className="text-sm leading-6 text-gray-900">{person.email}</dd>
              </div>
              <div className="flex items-center gap-x-2">
                <dt className="flex-none text-sm text-gray-500">
                  <span className="sr-only">Phone</span>
                  <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                </dt>
                <dd className="text-sm leading-6 text-gray-900">{person.phone}</dd>
              </div>
              <div className="flex items-center gap-x-2">
                <dt className="flex-none text-sm text-gray-500">
                  <span className="sr-only">Department</span>
                  <BuildingOfficeIcon className="h-5 w-5" aria-hidden="true" />
                </dt>
                <dd className="text-sm leading-6 text-gray-900">{person.department}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      {showAddMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={() => setShowAddMember(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Add Team Member</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="input mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        id="role"
                        className="input mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="input mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        className="input mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <select
                        id="department"
                        name="department"
                        className="input mt-1"
                      >
                        <option value="engineering">Engineering</option>
                        <option value="design">Design</option>
                        <option value="product">Product</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn btn-primary sm:ml-3"
                  onClick={() => setShowAddMember(false)}
                >
                  Add Member
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mt-3 sm:mt-0"
                  onClick={() => setShowAddMember(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 