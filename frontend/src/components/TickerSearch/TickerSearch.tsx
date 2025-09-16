import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './TickerSearch.css';

interface TickerResult {
  symbol: string;
  name: string;
  type: string;
  market: string;
  currency: string;
  matchScore: number;
}

interface TickerSearchProps {
  onTickerSelect?: (ticker: TickerResult) => void;
  placeholder?: string;
  showAddToWatchlist?: boolean;
  className?: string;
}

const TickerSearch: React.FC<TickerSearchProps> = ({
  onTickerSelect,
  placeholder = 'Search stocks, ETFs, indices...',
  showAddToWatchlist = true,
  className = ''
}) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TickerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [marketFilter, setMarketFilter] = useState('all');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data for demonstration - in real app, this would come from a financial data API
  const mockTickers: TickerResult[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', market: 'NASDAQ', currency: 'USD', matchScore: 1.0 },
    { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', type: 'Stock', market: 'NASDAQ', currency: 'USD', matchScore: 0.95 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Stock', market: 'NASDAQ', currency: 'USD', matchScore: 0.9 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'Stock', market: 'NASDAQ', currency: 'USD', matchScore: 0.85 },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', type: 'Stock', market: 'NASDAQ', currency: 'USD', matchScore: 0.8 },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', market: 'NYSE', currency: 'USD', matchScore: 0.7 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', market: 'NASDAQ', currency: 'USD', matchScore: 0.65 },
    { symbol: 'BTC-USD', name: 'Bitcoin USD', type: 'Cryptocurrency', market: 'CRYPTO', currency: 'USD', matchScore: 0.6 },
    { symbol: 'ETH-USD', name: 'Ethereum USD', type: 'Cryptocurrency', market: 'CRYPTO', currency: 'USD', matchScore: 0.55 },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    const searchTimer = setTimeout(() => {
      const filteredResults = mockTickers
        .filter(ticker => {
          const matchesQuery = 
            ticker.symbol.toLowerCase().includes(query.toLowerCase()) ||
            ticker.name.toLowerCase().includes(query.toLowerCase());
          
          const matchesMarket = marketFilter === 'all' || ticker.market.toLowerCase() === marketFilter.toLowerCase();
          
          return matchesQuery && matchesMarket;
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      setResults(filteredResults);
      setShowDropdown(filteredResults.length > 0);
      setIsLoading(false);
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query, marketFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleTickerSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleTickerSelect = (ticker: TickerResult) => {
    setQuery(ticker.symbol);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onTickerSelect?.(ticker);
  };

  const addToWatchlist = async (ticker: TickerResult) => {
    if (!user) return;

    try {
      const response = await fetch('/api/auth/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          symbol: ticker.symbol,
          name: ticker.name,
          market: ticker.market
        })
      });

      if (response.ok) {
        // Show success message
        console.log(`Added ${ticker.symbol} to watchlist`);
      } else {
        console.error('Failed to add to watchlist');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'stock':
        return '📈';
      case 'etf':
        return '📊';
      case 'cryptocurrency':
        return '₿';
      default:
        return '💼';
    }
  };

  return (
    <div className={`ticker-search ${className}`} ref={searchRef}>
      <div className="search-controls">
        <div className="search-input-container">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
          />
          {isLoading && <div className="loading-spinner">⏳</div>}
        </div>
        
        <select 
          value={marketFilter} 
          onChange={(e) => setMarketFilter(e.target.value)}
          className="market-filter"
          title="Filter by market"
          aria-label="Filter tickers by market"
        >
          <option value="all">All Markets</option>
          <option value="nasdaq">NASDAQ</option>
          <option value="nyse">NYSE</option>
          <option value="crypto">Crypto</option>
        </select>
      </div>

      {showDropdown && (
        <div className="search-results">
          {results.map((ticker, index) => (
            <div
              key={ticker.symbol}
              className={`result-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleTickerSelect(ticker)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="ticker-info">
                <div className="ticker-main">
                  <span className="ticker-icon">{getTypeIcon(ticker.type)}</span>
                  <div className="ticker-details">
                    <span className="ticker-symbol">{ticker.symbol}</span>
                    <span className="ticker-name">{ticker.name}</span>
                  </div>
                </div>
                <div className="ticker-meta">
                  <span className="ticker-market">{ticker.market}</span>
                  <span className="ticker-type">{ticker.type}</span>
                </div>
              </div>
              
              {showAddToWatchlist && user && (
                <button
                  className="add-to-watchlist-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWatchlist(ticker);
                  }}
                  title="Add to watchlist"
                >
                  ⭐
                </button>
              )}
            </div>
          ))}
          
          {results.length === 0 && !isLoading && query.length >= 2 && (
            <div className="no-results">
              No tickers found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TickerSearch;