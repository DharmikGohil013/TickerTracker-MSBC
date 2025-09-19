import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/Icons/Icons';
import { StockService, StockQuote, MarketOverview } from '../../services/stockService';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [marketData, setMarketData] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      setError(null);
      const data = await StockService.getMarketOverview();
      setMarketData(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching market data:', err);
      // Use mock data as fallback
      setMarketData({
        indices: {},
        topMovers: mockTopMovers,
        marketStatus: 'open',
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
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

  return (
    <div className="dashboard-page">
      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.firstName || user?.username || 'User'}!</h1>
            <p>Here's what's happening with your portfolio and watchlist today.</p>
          </div>

          {/* Market Overview Section */}
          <div className="market-overview-section">
            <h2 className="section-title">Market Overview</h2>
            <div className="market-overview-cards">
              {/* Top Gainers */}
              <div className="market-card">
                <div className="market-card-header">
                  <h3>Top Gainers</h3>
                  <Icons.TrendingUp className="trend-icon gain" />
                </div>
                <div className="market-card-content">
                  {topGainers.map((stock) => (
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
                  ))}
                </div>
                <Link to="/market" className="market-card-link">
                  View All Gainers
                  <Icons.ArrowRight className="arrow-icon" />
                </Link>
              </div>

              {/* Top Losers */}
              <div className="market-card">
                <div className="market-card-header">
                  <h3>Top Losers</h3>
                  <Icons.TrendingDown className="trend-icon loss" />
                </div>
                <div className="market-card-content">
                  {topLosers.map((stock) => (
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
                  ))}
                </div>
                <Link to="/market" className="market-card-link">
                  View All Losers
                  <Icons.ArrowRight className="arrow-icon" />
                </Link>
              </div>
            </div>
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
