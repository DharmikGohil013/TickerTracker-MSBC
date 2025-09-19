import React from 'react';
import { Icons } from '../../components/Icons/Icons';
import '../Auth/Auth.css';

interface HomeProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <nav className="home-nav">
          <div className="home-logo">
            <Icons.Logo />
            <span className="home-logo-text">Stock Scope</span>
          </div>
          <div className="home-user-info">
            <span className="home-welcome">
              Welcome, {user.firstName} {user.lastName}!
            </span>
            <button 
              onClick={onLogout}
              className="home-logout-btn"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <div className="home-content">
          <h1 className="home-title">Welcome to Stock Scope</h1>
          <p className="home-subtitle">
            Your account has been successfully created and verified! 
            You're now ready to start tracking and analyzing your investments.
          </p>

          <div className="home-features">
            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Icons.Chart />
              </div>
              <h3 className="home-feature-title">Advanced Analytics</h3>
              <p className="home-feature-description">
                Get detailed insights and analysis for your stock portfolio
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Icons.TrendingUp />
              </div>
              <h3 className="home-feature-title">Real-time Data</h3>
              <p className="home-feature-description">
                Access live market data and track price movements
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Icons.Heart />
              </div>
              <h3 className="home-feature-title">Watchlists</h3>
              <p className="home-feature-description">
                Create and manage personalized stock watchlists
              </p>
            </div>

            <div className="home-feature-card">
              <div className="home-feature-icon">
                <Icons.Portfolio />
              </div>
              <h3 className="home-feature-title">Portfolio Tracking</h3>
              <p className="home-feature-description">
                Monitor your investments and track performance
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;