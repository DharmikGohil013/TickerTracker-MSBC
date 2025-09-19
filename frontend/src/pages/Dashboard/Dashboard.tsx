import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/Icons/Icons';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.firstName || user?.username || 'User'}!</h1>
            <p>Here's what's happening with your portfolio and watchlist today.</p>
          </div>

          <div className="dashboard-grid">
            {/* Market Overview Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <Icons.TrendingUp />
                <h3>Market Overview</h3>
              </div>
              <div className="card-content">
                <p>Track the latest market trends and performance indicators.</p>
                <Link to="/app/market" className="card-link">
                  View Market →
                </Link>
              </div>
            </div>

            {/* Portfolio Summary Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <Icons.Portfolio />
                <h3>Portfolio</h3>
              </div>
              <div className="card-content">
                <p>Monitor your investments and track performance.</p>
                <Link to="/app/portfolio" className="card-link">
                  View Portfolio →
                </Link>
              </div>
            </div>

            {/* Watchlist Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <Icons.Heart />
                <h3>Watchlist</h3>
              </div>
              <div className="card-content">
                <p>Keep track of stocks you're interested in.</p>
                <Link to="/app/watchlist" className="card-link">
                  View Watchlist →
                </Link>
              </div>
            </div>

            {/* News & Insights Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <Icons.News />
                <h3>Market News</h3>
              </div>
              <div className="card-content">
                <p>Stay updated with the latest financial news and insights.</p>
                <Link to="/app/news" className="card-link">
                  Read News →
                </Link>
              </div>
            </div>

            {/* Search Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <Icons.Search />
                <h3>Stock Search</h3>
              </div>
              <div className="card-content">
                <p>Search and analyze individual stocks and ETFs.</p>
                <Link to="/app/search" className="card-link">
                  Search Stocks →
                </Link>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <Icons.Chart />
                <h3>Analytics</h3>
              </div>
              <div className="card-content">
                <p>Advanced analytics and performance insights.</p>
                <Link to="/app/analytics" className="card-link">
                  View Analytics →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
