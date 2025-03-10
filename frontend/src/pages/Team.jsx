import { useState } from 'react';
import {
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function Team() {
  const [showAddMember, setShowAddMember] = useState(false);
  const [members, setMembers] = useState([]);

  const removeMember = (id) => {
    setMembers(members.filter(member => member.id !== id));
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Team</h1>
          <p className="mt-2 text-sm text-gray-300">
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

      <div className="mt-8">
        {members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300">No team members added yet. Click the "Add Member" button to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((person) => (
              <div 
                key={person.id} 
                className="card p-6 relative group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <button
                  onClick={() => removeMember(person.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/20"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-x-4">
                  <div className="relative">
                    <img className="h-12 w-12 rounded-full ring-2 ring-indigo-500/20" src={person.imageUrl} alt="" />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-[#1E293B]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-gray-100">{person.name}</h3>
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-xs leading-5 text-gray-300">{person.role}</p>
                    </div>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-x-3 p-2 rounded-lg hover:bg-[#334155] transition-colors duration-200">
                    <dt className="flex-none">
                      <span className="sr-only">Email</span>
                      <EnvelopeIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                    </dt>
                    <dd className="text-sm leading-6 text-gray-100 truncate">{person.email}</dd>
                  </div>
                  <div className="flex items-center gap-x-3 p-2 rounded-lg hover:bg-[#334155] transition-colors duration-200">
                    <dt className="flex-none">
                      <span className="sr-only">Phone</span>
                      <PhoneIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                    </dt>
                    <dd className="text-sm leading-6 text-gray-100 truncate">{person.phone}</dd>
                  </div>
                  <div className="flex items-center gap-x-3 p-2 rounded-lg hover:bg-[#334155] transition-colors duration-200">
                    <dt className="flex-none">
                      <span className="sr-only">Department</span>
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                    </dt>
                    <dd className="text-sm leading-6 text-gray-100 truncate">{person.department}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-[#1E293B] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-[#1E293B] text-gray-400 hover:text-gray-300"
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
                  <h3 className="text-base font-semibold leading-6 text-gray-100">Add Team Member</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300">
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
                      <label htmlFor="role" className="block text-sm font-medium text-gray-300">
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
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
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
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
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
                      <label htmlFor="department" className="block text-sm font-medium text-gray-300">
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