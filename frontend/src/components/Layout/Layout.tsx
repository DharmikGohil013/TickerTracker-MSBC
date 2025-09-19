import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-content">
        <Header />
        <main className="layout-main">
          <div className="layout-main-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;