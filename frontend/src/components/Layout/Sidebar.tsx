import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../Icons/Icons';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const getUserInitials = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/app/dashboard',
      icon: <Icons.Dashboard />,
    },
    {
      name: 'Market',
      href: '/app/market',
      icon: <Icons.TrendingUp />,
    },
    {
      name: 'News',
      href: '/app/news',
      icon: <Icons.News />,
    },
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        {/* Logo Section */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <img src="/Stock Scope.png" alt="Stock Scope" />
          </div>
          <span className="sidebar-logo-text">Stock Scope</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">
            <h3 className="sidebar-section-title">Main</h3>
            <div className="sidebar-nav-items">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href === '/app/dashboard' && location.pathname === '/dashboard');
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="sidebar-nav-icon">
                      {item.icon}
                    </span>
                    <span className="sidebar-nav-text">{item.name}</span>
                    {isActive && <div className="sidebar-active-indicator" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer - Profile Section */}
        <div className="sidebar-footer">
          <div className="sidebar-profile" ref={dropdownRef}>
            <div className="sidebar-profile-dropdown">
              <button className="sidebar-profile-trigger" onClick={toggleProfileDropdown}>
                <div className="sidebar-profile-avatar">
                  {getUserInitials()}
                </div>
                <div className="sidebar-profile-info">
                  <span className="sidebar-profile-name">
                    {user?.firstName || user?.username || 'User'}
                  </span>
                  <span className="sidebar-profile-email">
                    {user?.email || 'user@example.com'}
                  </span>
                </div>
                <div className="sidebar-profile-chevron">
                  <Icons.ChevronDown />
                </div>
              </button>
              
              {profileDropdownOpen && (
                <div className="sidebar-profile-dropdown-menu">
                  <NavLink to="/app/profile" className="sidebar-dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                    <Icons.User />
                    <span>Profile Settings</span>
                  </NavLink>
                  <NavLink to="/app/settings" className="sidebar-dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                    <Icons.Settings />
                    <span>Account Settings</span>
                  </NavLink>
                  <div className="sidebar-dropdown-divider"></div>
                  <button onClick={handleLogout} className="sidebar-dropdown-item sidebar-logout-item">
                    <Icons.Logout />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;