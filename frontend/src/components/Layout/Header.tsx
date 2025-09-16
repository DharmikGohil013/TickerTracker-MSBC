import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/app/dashboard" className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0.5 rounded-full border border-white opacity-30"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <span className="text-lg font-bold text-gray-900">Stock Scope</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stocks, ETFs, crypto..."
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-xs">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <span className="hidden md:block text-gray-700 font-medium text-sm">
                {user?.firstName} {user?.lastName}
              </span>
              <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  to="/app/profile"
                  className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/app/settings"
                  className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Settings
                </Link>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;