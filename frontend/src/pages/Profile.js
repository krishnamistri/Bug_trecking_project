import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-600 text-white rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
          <p className="text-xl text-gray-600 capitalize">{user?.role}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <span className="text-sm text-gray-900">{user?.email}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Member Since</span>
            <span className="text-sm text-gray-900">
              {user && new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div>
              <h3 className="font-semibold text-gray-900">Role Permissions</h3>
              <p className="text-sm text-gray-600">
                {user?.role === 'admin' && 'Full access: View all bugs, assign, manage users'}
                {user?.role === 'developer' && 'Manage assigned bugs, update status, add comments'}
                {user?.role === 'tester' && 'Create bugs, verify fixes, reopen issues'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
