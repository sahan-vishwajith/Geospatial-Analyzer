import React from 'react';
import { UserIcon, LockClosedIcon } from '../icons/Icons';

const SettingsView: React.FC = () => {
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully! (Demo)');
  };

  return (
    <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-300">Username</label>
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                        type="text"
                        name="username"
                        id="username"
                        className="w-full pl-10 pr-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        defaultValue="demo_user"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="current-password" className="block text-sm font-medium leading-6 text-gray-300">Current Password</label>
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                        type="password"
                        name="current-password"
                        id="current-password"
                        className="w-full pl-10 pr-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Enter current password"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-gray-300">New Password</label>
                    <div className="relative mt-2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        className="w-full pl-10 pr-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Enter new password"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-2 px-4 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default SettingsView;