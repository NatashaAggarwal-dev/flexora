import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebug: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed top-20 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-sm">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
          <span>Loading auth...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed top-20 right-4 bg-red-100 border border-red-300 rounded-lg p-3 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-red-600">Not logged in</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 bg-green-100 border border-green-300 rounded-lg p-3 text-sm">
      <div className="flex items-center space-x-2">
        <span className="text-green-600">✓ Logged in as: {user.name}</span>
      </div>
      <div className="text-xs text-green-600 mt-1">
        Email: {user.email}
      </div>
    </div>
  );
};

export default AuthDebug; 