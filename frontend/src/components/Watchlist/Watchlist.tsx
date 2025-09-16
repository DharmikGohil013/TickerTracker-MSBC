import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Watchlist.css';

interface WatchlistItem {
  _id: string;
  symbol: string;
  name: string;
  market: string;
  addedAt: string;
  currentPrice?: number;
  change?: number;
  changePercent?: number;
}

interface WatchlistProps {
  className?: string;
  showPrices?: boolean;
  maxItems?: number;
}

const Watchlist: React.FC<WatchlistProps> = ({ 
  className = '', 
  showPrices = true, 
  maxItems 
}) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock price data - in real app, this would come from a financial data API
  const mockPrices: Record<string, { price: number; change: number; changePercent: number }> = {
    'AAPL': { price: 182.52, change: 2.41, changePercent: 1.34 },
    'GOOGL': { price: 138.21, change: -1.15, changePercent: -0.82 },
    'MSFT': { price: 378.85, change: 5.23, changePercent: 1.40 },
    'TSLA': { price: 248.42, change: -3.67, changePercent: -1.45 },
    'AMZN': { price: 151.94, change: 0.87, changePercent: 0.58 },
    'SPY': { price: 455.26, change: 2.11, changePercent: 0.47 },
    'QQQ': { price: 391.45, change: 1.89, changePercent: 0.49 },
    'BTC-USD': { price: 43250.00, change: -525.00, changePercent: -1.20 },
    'ETH-USD': { price: 2635.40, change: 45.20, changePercent: 1.74 },
  };

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  const fetchWatchlist = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/watchlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add mock price data
        const watchlistWithPrices = data.watchlist.map((item: any) => ({
          ...item,
          currentPrice: mockPrices[item.symbol]?.price,
          change: mockPrices[item.symbol]?.change,
          changePercent: mockPrices[item.symbol]?.changePercent,
        }));

        setWatchlist(maxItems ? watchlistWithPrices.slice(0, maxItems) : watchlistWithPrices);
      } else {
        throw new Error('Failed to fetch watchlist');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load watchlist');
      console.error('Error fetching watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWatchlist = async (itemId: string) => {
    try {
      const response = await fetch(`/api/auth/watchlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setWatchlist(prev => prev.filter(item => item._id !== itemId));
      } else {
        throw new Error('Failed to remove from watchlist');
      }
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatPrice(change)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  const getChangeClass = (change: number): string => {
    return change >= 0 ? 'positive' : 'negative';
  };

  if (!user) {
    return (
      <div className={`watchlist ${className}`}>
        <div className="watchlist-empty">
          <p>Please log in to view your watchlist</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`watchlist ${className}`}>
        <div className="watchlist-loading">
          <div className="loading-spinner">⏳</div>
          <p>Loading watchlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`watchlist ${className}`}>
        <div className="watchlist-error">
          <p>Error: {error}</p>
          <button onClick={fetchWatchlist} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className={`watchlist ${className}`}>
        <div className="watchlist-empty">
          <p>Your watchlist is empty</p>
          <p className="text-sm">Add some tickers to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`watchlist ${className}`}>
      <div className="watchlist-items">
        {watchlist.map((item) => (
          <div key={item._id} className="watchlist-item">
            <div className="item-info">
              <div className="item-main">
                <span className="item-symbol">{item.symbol}</span>
                <span className="item-name">{item.name}</span>
              </div>
              <div className="item-meta">
                <span className="item-market">{item.market}</span>
              </div>
            </div>

            {showPrices && item.currentPrice && (
              <div className="item-prices">
                <div className="current-price">
                  {formatPrice(item.currentPrice)}
                </div>
                {item.change !== undefined && item.changePercent !== undefined && (
                  <div className={`price-change ${getChangeClass(item.change)}`}>
                    {formatChange(item.change, item.changePercent)}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => removeFromWatchlist(item._id)}
              className="remove-btn"
              title="Remove from watchlist"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;