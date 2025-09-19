import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icons } from '../Icons/Icons';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();

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
      name: 'Portfolio',
      href: '/app/portfolio',
      icon: <Icons.Portfolio />,
    },
    {
      name: 'Watchlist',
      href: '/app/watchlist',
      icon: <Icons.Heart />,
    },
    {
      name: 'Search',
      href: '/app/search',
      icon: <Icons.Search />,
    },
    {
      name: 'News',
      href: '/app/news',
      icon: <Icons.News />,
    },
    {
      name: 'Analytics',
      href: '/app/analytics',
      icon: <Icons.Chart />,
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

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-content">
            <div className="sidebar-footer-icon">
              <Icons.Settings />
            </div>
            <span className="sidebar-footer-text">Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;