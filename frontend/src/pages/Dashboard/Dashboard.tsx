import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TickerSearch from '../../components/TickerSearch/TickerSearch';
import Watchlist from '../../components/Watchlist/Watchlist';

interface DashboardStats {
  totalWatchlistItems: number;
  totalPortfolioValue: number;
  dailyChange: number;
  dailyChangePercent: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalWatchlistItems: 0,
    totalPortfolioValue: 0,
    dailyChange: 0,
    dailyChangePercent: 0
  });

  // Mock market indices data
  const marketIndices = [
    { name: 'S&P 500', symbol: 'SPX', value: 4567.18, change: 45.67, changePercent: 1.01 },
    { name: 'Dow Jones', symbol: 'DJI', value: 35641.89, change: -125.43, changePercent: -0.35 },
    { name: 'NASDAQ', symbol: 'IXIC', value: 14305.73, change: 89.21, changePercent: 0.63 },
    { name: 'Russell 2000', symbol: 'RUT', value: 2034.56, change: 12.34, changePercent: 0.61 },
  ];

  useEffect(() => {
    // Mock stats - in real app, this would come from backend
    setStats({
      totalWatchlistItems: 8,
      totalPortfolioValue: 125430.50,
      dailyChange: 2341.25,
      dailyChangePercent: 1.9
    });
  }, []);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatChange = (change: number, changePercent: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatCurrency(change)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  const getChangeClass = (change: number): string => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || 'Investor'}!
        </h1>
        <p className="text-blue-100">
          Track your investments and stay updated with market trends
        </p>
      </div>

      {/* Quick Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Ticker Search</h2>
        <TickerSearch 
          placeholder="Search and add to watchlist..."
          showAddToWatchlist={true}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Portfolio Value</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalPortfolioValue)}
              </p>
              <p className={`text-sm ${getChangeClass(stats.dailyChange)}`}>
                {formatChange(stats.dailyChange, stats.dailyChangePercent)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">⭐</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Watchlist Items</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalWatchlistItems}</p>
              <p className="text-sm text-gray-600">Actively tracking</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Daily P&L</h3>
              <p className={`text-2xl font-semibold ${getChangeClass(stats.dailyChange)}`}>
                {formatCurrency(stats.dailyChange)}
              </p>
              <p className={`text-sm ${getChangeClass(stats.dailyChange)}`}>
                {stats.dailyChangePercent.toFixed(2)}% today
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">📰</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Market Status</h3>
              <p className="text-2xl font-semibold text-green-600">Open</p>
              <p className="text-sm text-gray-600">Closes in 4h 23m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Watchlist</h2>
              <a href="/search" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Add more →
              </a>
            </div>
            <Watchlist showPrices={true} />
          </div>
        </div>

        {/* Market Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Market Overview</h2>
            <div className="space-y-4">
              {marketIndices.map((index) => (
                <div key={index.symbol} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{index.name}</div>
                    <div className="text-sm text-gray-500">{index.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {index.value.toLocaleString()}
                    </div>
                    <div className={`text-sm ${getChangeClass(index.change)}`}>
                      {formatChange(index.change, index.changePercent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <a 
                href="/market" 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md text-center block transition-colors"
              >
                View Full Market
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity or News Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Market News</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-400 pl-4">
            <h3 className="font-medium text-gray-900">Market Update</h3>
            <p className="text-sm text-gray-600 mt-1">
              Markets continue to show resilience amid economic uncertainty...
            </p>
            <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
          </div>
          <div className="border-l-4 border-green-400 pl-4">
            <h3 className="font-medium text-gray-900">Tech Earnings Preview</h3>
            <p className="text-sm text-gray-600 mt-1">
              Major tech companies prepare to report quarterly earnings...
            </p>
            <p className="text-xs text-gray-500 mt-2">4 hours ago</p>
          </div>
          <div className="border-l-4 border-orange-400 pl-4">
            <h3 className="font-medium text-gray-900">Federal Reserve Update</h3>
            <p className="text-sm text-gray-600 mt-1">
              Fed officials signal potential changes to monetary policy...
            </p>
            <p className="text-xs text-gray-500 mt-2">6 hours ago</p>
          </div>
        </div>
        <div className="mt-6">
          <a 
            href="/news" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all news →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;