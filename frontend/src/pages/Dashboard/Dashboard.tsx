import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/Icons/Icons';
import { StockService, MarketOverview } from '../../services/stockService';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState<MarketOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for fallback
  const mockTopMovers = {
    gainers: [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 456.78, change: 23.45, changePercent: 5.42, volume: 45678900, lastUpdated: new Date().toISOString() },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 112.34, change: 8.90, changePercent: 8.61, volume: 34567800, lastUpdated: new Date().toISOString() },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 256.78, change: 15.67, changePercent: 6.50, volume: 56789000, lastUpdated: new Date().toISOString() },
      { symbol: 'AAPL', name: 'Apple Inc.', price: 178.90, change: 4.56, changePercent: 2.62, volume: 67890123, lastUpdated: new Date().toISOString() }
    ],
    losers: [
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 387.65, change: -18.90, changePercent: -4.65, volume: 12345678, lastUpdated: new Date().toISOString() },
      { symbol: 'META', name: 'Meta Platforms Inc.', price: 298.76, change: -12.45, changePercent: -4.00, volume: 34567890, lastUpdated: new Date().toISOString() },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 134.78, change: -5.67, changePercent: -4.04, volume: 45678901, lastUpdated: new Date().toISOString() },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 125.89, change: -3.45, changePercent: -2.67, volume: 23456789, lastUpdated: new Date().toISOString() }
    ],
    mostActive: []
  };

  // Fetch market data
  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await StockService.getMarketOverview();
      setMarketData(data);
    } catch (err: any) {
      console.error('Error fetching market data:', err);
      setError('Unable to fetch real-time data. Showing demo data.');
      // Use mock data as fallback
      setMarketData({
        indices: {},
        topMovers: mockTopMovers,
        marketStatus: 'open',
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Get safe top movers
  const getTopMovers = (type: 'gainers' | 'losers') => {
    try {
      if (marketData?.topMovers && marketData.topMovers[type]) {
        return marketData.topMovers[type].slice(0, 4);
      }
      return mockTopMovers[type].slice(0, 4);
    } catch (err) {
      console.error('Error getting movers:', err);
      return mockTopMovers[type].slice(0, 4);
    }
  };

  const topGainers = getTopMovers('gainers');
  const topLosers = getTopMovers('losers');

  // Loading skeleton component
  const StockItemSkeleton = () => (
    <div className="stock-item">
      <div className="stock-info">
        <div className="skeleton skeleton-symbol"></div>
        <div className="skeleton skeleton-name"></div>
      </div>
      <div className="stock-metrics">
        <div className="skeleton skeleton-price"></div>
        <div className="skeleton skeleton-change"></div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Welcome back, {user?.firstName || user?.username || 'Trader'}!
          </h1>
          <p className="dashboard-subtitle">
            Track markets, manage your portfolio, and stay ahead of the trends
          </p>
          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Market Overview Section */}
        <div className="market-overview-section">
          <h2 className="section-title">Market Overview</h2>
          <div className="market-overview-cards">
            {/* Top Gainers */}
            <div className="market-card">
              <div className="market-card-header">
                <h3>Top Gainers</h3>
                <div className="trend-icon gain">
                  <Icons.TrendingUp />
                </div>
              </div>
              <div className="market-card-content">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <StockItemSkeleton key={index} />
                  ))
                ) : (
                  topGainers.map((stock) => (
                    <div key={stock.symbol} className="stock-item">
                      <div className="stock-info">
                        <span className="stock-symbol">{stock.symbol}</span>
                        <span className="stock-name">{stock.name}</span>
                      </div>
                      <div className="stock-metrics">
                        <span className="stock-price">{formatCurrency(stock.price)}</span>
                        <span className="stock-change positive">
                          +{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link to="/market" className="market-card-link">
                View All Gainers
                <div className="arrow-icon">
                  <Icons.ChevronDown />
                </div>
              </Link>
            </div>

            {/* Top Losers */}
            <div className="market-card">
              <div className="market-card-header">
                <h3>Top Losers</h3>
                <div className="trend-icon loss">
                  <Icons.TrendingDown />
                </div>
              </div>
              <div className="market-card-content">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <StockItemSkeleton key={index} />
                  ))
                ) : (
                  topLosers.map((stock) => (
                    <div key={stock.symbol} className="stock-item">
                      <div className="stock-info">
                        <span className="stock-symbol">{stock.symbol}</span>
                        <span className="stock-name">{stock.name}</span>
                      </div>
                      <div className="stock-metrics">
                        <span className="stock-price">{formatCurrency(stock.price)}</span>
                        <span className="stock-change negative">
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link to="/market" className="market-card-link">
                View All Losers
                <div className="arrow-icon">
                  <Icons.ChevronDown />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="dashboard-grid">
            {/* Market Overview Card */}
            <Link to="/market" className="dashboard-card">
              <div className="card-icon">
                <Icons.TrendingUp />
              </div>
              <div className="card-content">
                <h3>Market Overview</h3>
                <p>Track the latest market trends and performance indicators</p>
              </div>
              <div className="card-arrow">
                <Icons.ChevronDown />
              </div>
            </Link>

            {/* Portfolio Summary Card */}
            <Link to="/portfolio" className="dashboard-card">
              <div className="card-icon">
                <Icons.Portfolio />
              </div>
              <div className="card-content">
                <h3>Portfolio</h3>
                <p>Monitor your investments and track performance</p>
              </div>
              <div className="card-arrow">
                <Icons.ChevronDown />
              </div>
            </Link>

            {/* Watchlist Card */}
            <Link to="/watchlist" className="dashboard-card">
              <div className="card-icon">
                <Icons.Heart />
              </div>
              <div className="card-content">
                <h3>Watchlist</h3>
                <p>Keep track of stocks you're interested in</p>
              </div>
              <div className="card-arrow">
                <Icons.ChevronDown />
              </div>
            </Link>

            {/* News & Insights Card */}
            <Link to="/news" className="dashboard-card">
              <div className="card-icon">
                <Icons.News />
              </div>
              <div className="card-content">
                <h3>Market News</h3>
                <p>Stay updated with the latest financial news and insights</p>
              </div>
              <div className="card-arrow">
                <Icons.ChevronDown />
              </div>
            </Link>

            {/* Search Card */}
            <Link to="/search" className="dashboard-card">
              <div className="card-icon">
                <Icons.Search />
              </div>
              <div className="card-content">
                <h3>Stock Search</h3>
                <p>Search and analyze individual stocks and ETFs</p>
              </div>
              <div className="card-arrow">
                <Icons.ChevronDown />
              </div>
            </Link>

            {/* Analytics Card */}
            <Link to="/analytics" className="dashboard-card">
              <div className="card-icon">
                <Icons.Chart />
              </div>
              <div className="card-content">
                <h3>Analytics</h3>
                <p>Advanced analytics and performance insights</p>
              </div>
              <div className="card-arrow">
                <Icons.ChevronDown />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
