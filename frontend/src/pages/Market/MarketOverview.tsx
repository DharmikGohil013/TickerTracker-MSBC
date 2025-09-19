import React, { useState, useEffect } from 'react';
import { StockService, StockQuote, StockSearchResult, MarketOverview as MarketData } from '../../services/stockService';
import './Market.css';

type MoverType = 'gainers' | 'losers' | 'mostActive';

interface IndexData {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const MarketOverview: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [selectedMoverType, setSelectedMoverType] = useState<MoverType>('gainers');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Mock market indices data
  const mockIndices: IndexData[] = [
    { symbol: 'SPY', name: 'S&P 500', value: 4456.78, change: 12.45, changePercent: 0.28 },
    { symbol: 'QQQ', name: 'NASDAQ 100', value: 378.92, change: -2.34, changePercent: -0.61 },
    { symbol: 'IWM', name: 'Russell 2000', value: 201.34, change: 5.67, changePercent: 2.90 },
    { symbol: 'VTI', name: 'Total Stock Market', value: 245.89, change: 1.23, changePercent: 0.50 },
    { symbol: 'DIA', name: 'Dow Jones', value: 356.78, change: 8.90, changePercent: 2.56 },
    { symbol: 'EFA', name: 'MSCI EAFE', value: 78.45, change: -1.45, changePercent: -1.81 }
  ];

  // Mock top movers data
  const mockMovers = {
    gainers: [
      { 
        symbol: 'NVDA', 
        name: 'NVIDIA Corporation', 
        price: 456.78, 
        change: 23.45, 
        changePercent: 5.42, 
        volume: 45678900, 
        marketCap: 1123456789000,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'AMD', 
        name: 'Advanced Micro Devices', 
        price: 112.34, 
        change: 8.90, 
        changePercent: 8.61, 
        volume: 34567800, 
        marketCap: 181234567890,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'TSLA', 
        name: 'Tesla Inc.', 
        price: 256.78, 
        change: 15.67, 
        changePercent: 6.50, 
        volume: 56789000, 
        marketCap: 815678901234,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'AAPL', 
        name: 'Apple Inc.', 
        price: 178.90, 
        change: 4.56, 
        changePercent: 2.62, 
        volume: 67890123, 
        marketCap: 2789012345678,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'MSFT', 
        name: 'Microsoft Corporation', 
        price: 334.56, 
        change: 12.34, 
        changePercent: 3.83, 
        volume: 23456789, 
        marketCap: 2456789012345,
        lastUpdated: new Date().toISOString()
      }
    ],
    losers: [
      { 
        symbol: 'NFLX', 
        name: 'Netflix Inc.', 
        price: 387.65, 
        change: -18.90, 
        changePercent: -4.65, 
        volume: 12345678, 
        marketCap: 172345678901,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'META', 
        name: 'Meta Platforms Inc.', 
        price: 298.76, 
        change: -12.45, 
        changePercent: -4.00, 
        volume: 34567890, 
        marketCap: 803456789012,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'AMZN', 
        name: 'Amazon.com Inc.', 
        price: 134.78, 
        change: -5.67, 
        changePercent: -4.04, 
        volume: 45678901, 
        marketCap: 1396789012345,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'GOOGL', 
        name: 'Alphabet Inc.', 
        price: 125.89, 
        change: -3.45, 
        changePercent: -2.67, 
        volume: 23456789, 
        marketCap: 1567890123456,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'CRM', 
        name: 'Salesforce Inc.', 
        price: 198.45, 
        change: -6.78, 
        changePercent: -3.30, 
        volume: 12345678, 
        marketCap: 195678901234,
        lastUpdated: new Date().toISOString()
      }
    ],
    mostActive: [
      { 
        symbol: 'SPY', 
        name: 'SPDR S&P 500 ETF', 
        price: 445.67, 
        change: 2.34, 
        changePercent: 0.53, 
        volume: 98765432, 
        marketCap: 0,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'QQQ', 
        name: 'Invesco QQQ Trust', 
        price: 378.90, 
        change: -1.23, 
        changePercent: -0.32, 
        volume: 87654321, 
        marketCap: 0,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'TSLA', 
        name: 'Tesla Inc.', 
        price: 256.78, 
        change: 15.67, 
        changePercent: 6.50, 
        volume: 76543210, 
        marketCap: 815678901234,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'AAPL', 
        name: 'Apple Inc.', 
        price: 178.90, 
        change: 4.56, 
        changePercent: 2.62, 
        volume: 67890123, 
        marketCap: 2789012345678,
        lastUpdated: new Date().toISOString()
      },
      { 
        symbol: 'AMD', 
        name: 'Advanced Micro Devices', 
        price: 112.34, 
        change: 8.90, 
        changePercent: 8.61, 
        volume: 65432109, 
        marketCap: 181234567890,
        lastUpdated: new Date().toISOString()
      }
    ]
  };

  // Fetch market overview data
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
        topMovers: mockMovers,
        marketStatus: 'open',
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle stock search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await StockService.searchStocks(searchQuery);
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (err: any) {
      console.error('Error searching stocks:', err);
      setSearchResults([]);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults([]);
    }
  };

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format large numbers
  const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Load initial data
  useEffect(() => {
    fetchMarketData();
  }, []);

  // Safely get current movers with multiple fallbacks
  const getCurrentMovers = () => {
    try {
      if (marketData?.topMovers && marketData.topMovers[selectedMoverType]) {
        return marketData.topMovers[selectedMoverType];
      }
      return mockMovers[selectedMoverType] || [];
    } catch (err) {
      console.error('Error getting movers:', err);
      return mockMovers[selectedMoverType] || [];
    }
  };

  const currentMovers = getCurrentMovers();

  return (
    <div className="market-page">
      <div className="market-container">
        <div className="market-header">
          <h1 className="market-title">Market Overview</h1>
          <p className="market-subtitle">
            Real-time market data, indices, and top performing stocks
          </p>
        </div>

        {/* Market Status Section */}
        <div className="market-status">
          <div className="status-card">
            <div className="status-header">
              <h3 className="status-title">US Markets</h3>
              <span className={`status-indicator ${marketData?.marketStatus === 'open' ? 'status-open' : 'status-closed'}`}>
                {marketData?.marketStatus === 'open' ? 'Open' : 'Closed'}
              </span>
            </div>
            <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
              {marketData?.marketStatus === 'open' ? 
                'Markets are currently open for trading' : 
                'Markets are closed. Next open: Monday 9:30 AM EST'
              }
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-header">
              <h3 className="status-title">Indian Markets</h3>
              <span className="status-indicator status-closed">Closed</span>
            </div>
            <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
              Markets are closed. Next open: Monday 9:15 AM IST
            </div>
          </div>
          
          <div className="status-card">
            <div className="status-header">
              <h3 className="status-title">Crypto Markets</h3>
              <span className="status-indicator status-open">24/7</span>
            </div>
            <div style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
              Cryptocurrency markets are always open
            </div>
          </div>
        </div>

        {/* Market Indices */}
        <div className="indices-section">
          <h2 className="section-title">Market Indices</h2>
          <div className="indices-grid">
            {mockIndices.map((index) => (
              <div key={index.symbol} className="index-card">
                <div className="index-header">
                  <div>
                    <div className="index-symbol">{index.symbol}</div>
                    <div className="index-name">{index.name}</div>
                  </div>
                </div>
                <div className="index-value">{formatCurrency(index.value)}</div>
                <div className={`index-change ${index.change >= 0 ? 'positive' : 'negative'}`}>
                  <span className="change-arrow">
                    {index.change >= 0 ? '↗' : '↘'}
                  </span>
                  <span>
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Movers */}
        <div className="movers-section">
          <h2 className="section-title">Top Movers</h2>
          <div className="movers-tabs">
            <button 
              className={`tab-button ${selectedMoverType === 'gainers' ? 'active' : ''}`}
              onClick={() => setSelectedMoverType('gainers')}
            >
              Top Gainers
            </button>
            <button 
              className={`tab-button ${selectedMoverType === 'losers' ? 'active' : ''}`}
              onClick={() => setSelectedMoverType('losers')}
            >
              Top Losers
            </button>
            <button 
              className={`tab-button ${selectedMoverType === 'mostActive' ? 'active' : ''}`}
              onClick={() => setSelectedMoverType('mostActive')}
            >
              Most Active
            </button>
          </div>
          
          <div className="movers-grid">
            {Array.isArray(currentMovers) && currentMovers.length > 0 ? (
              currentMovers.map((stock: any) => (
                <div key={stock.symbol} className="mover-card">
                  <div className="mover-header">
                    <div className="mover-info">
                      <div className="mover-symbol">{stock.symbol}</div>
                      <div className="mover-name">{stock.name}</div>
                    </div>
                    <div className="mover-price">
                      <div className="mover-current-price">{formatCurrency(stock.price)}</div>
                      <div className={`mover-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                  <div className="mover-stats">
                    <div className="stat-item">
                      <div className="stat-label">Volume</div>
                      <div className="stat-value">{(stock.volume / 1000000).toFixed(1)}M</div>
                    </div>
                    {stock.marketCap > 0 && (
                      <div className="stat-item">
                        <div className="stat-label">Market Cap</div>
                        <div className="stat-value">{formatLargeNumber(stock.marketCap)}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>No Data Available</h3>
                <p>Unable to load {selectedMoverType} data at the moment</p>
              </div>
            )}
          </div>
        </div>

        {/* Stock Search */}
        <div className="search-section">
          <div className="search-header">
            <h3 className="search-title">Search Stocks</h3>
            <p className="search-subtitle">Find and explore individual stocks and ETFs</p>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Enter stock symbol or company name..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result, index) => (
                <div key={index} className="search-result-item">
                  <div className="result-symbol">{result.symbol}</div>
                  <div className="result-name">{result.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
                    {result.exchange} • {result.type}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <h3>Error Loading Market Data</h3>
            <p>{error}</p>
            <button 
              className="search-button" 
              style={{ marginTop: '1rem' }}
              onClick={fetchMarketData}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketOverview;