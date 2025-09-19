import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import { Icons } from '../../components/Icons/Icons';
import stockService, { StockData, HistoricalDataPoint, NewsItem, Alert } from '../../services/stockService';
import '../Auth/Auth.css';
import './Home.css';

interface HomeProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onLogout: () => void;
}

// Mock data for charts - this will be replaced with real API data later
const generateMockPriceData = (symbol: string) => {
  const basePrice = symbol === 'AAPL' ? 175 : symbol === 'TSLA' ? 250 : symbol === 'BTC' ? 43000 : 100;
  const data = [];
  let price = basePrice;
  
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.05);
    price += change;
    data.push({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      high: parseFloat((price * 1.02).toFixed(2)),
      low: parseFloat((price * 0.98).toFixed(2))
    });
  }
  return data;
};

const mockNews = [
  {
    id: 1,
    title: "Apple Reports Strong Q4 Earnings Beat",
    summary: "Apple Inc. reported better-than-expected quarterly earnings, with iPhone sales driving growth despite economic headwinds...",
    source: "Reuters",
    time: "2 hours ago",
    sentiment: "positive",
    icon: "😃",
    link: "#"
  },
  {
    id: 2,
    title: "Tech Sector Faces Regulatory Challenges",
    summary: "New regulations proposed by Congress could impact major tech companies' operations and profitability in the coming quarters...",
    source: "Bloomberg",
    time: "4 hours ago",
    sentiment: "neutral",
    icon: "😐",
    link: "#"
  },
  {
    id: 3,
    title: "Market Volatility Expected This Week",
    summary: "Analysts predict increased market volatility due to upcoming Federal Reserve meeting and inflation data release...",
    source: "MarketWatch",
    time: "6 hours ago",
    sentiment: "negative",
    icon: "😡",
    link: "#"
  }
];

const mockAlerts = [
  {
    id: 1,
    type: "price_down",
    color: "red",
    icon: "🔴",
    title: "Price Alert",
    message: "TSLA price down 7% in 1hr",
    time: "Just now"
  },
  {
    id: 2,
    type: "sentiment_positive",
    color: "green",
    icon: "🟢",
    title: "Sentiment Alert",
    message: "BTC positive sentiment trending on Twitter",
    time: "5 min ago"
  },
  {
    id: 3,
    type: "volume_spike",
    color: "orange",
    icon: "🟡",
    title: "Volume Alert",
    message: "AAPL trading volume 3x above average",
    time: "15 min ago"
  },
  {
    id: 4,
    type: "breaking_news",
    color: "blue",
    icon: "🔵",
    title: "Breaking News",
    message: "Fed announces emergency meeting",
    time: "30 min ago"
  }
];

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [selectedMarket, setSelectedMarket] = useState('US');
  const [tickerInput, setTickerInput] = useState('');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // API Data State
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [alertsData, setAlertsData] = useState<Alert[]>([]);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Market configuration
  const marketConfig = {
    'US': {
      name: 'US Market',
      examples: ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'],
      placeholder: 'Enter US stock symbol (e.g., AAPL, TSLA, MSFT)',
      currency: 'USD'
    },
    'Indian': {
      name: 'Indian Market',
      examples: ['RELIANCE', 'INFY', 'TCS', 'BHARTIARTL', 'HDFCBANK'],
      placeholder: 'Enter Indian stock symbol (e.g., RELIANCE, INFY, TCS)',
      currency: 'INR'
    },
    'Crypto': {
      name: 'Cryptocurrency',
      examples: ['BTC', 'ETH', 'BNB', 'ADA', 'DOT'],
      placeholder: 'Enter crypto symbol (e.g., BTC, ETH, BNB)',
      currency: 'USD'
    }
  };

  // Fetch all data for selected ticker
  const fetchStockData = async (symbol: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data in parallel
      const [stock, historical, news, alerts, sentiment] = await Promise.allSettled([
        stockService.getStockData(symbol),
        stockService.getHistoricalData(symbol, '1M'),
        stockService.getSymbolNews(symbol, 10),
        stockService.getSymbolAlerts(symbol),
        stockService.getSocialSentiment(symbol)
      ]);

      // Handle stock data
      if (stock.status === 'fulfilled') {
        setStockData(stock.value);
      } else {
        console.error('Failed to fetch stock data:', stock.reason);
      }

      // Handle historical data
      if (historical.status === 'fulfilled') {
        setHistoricalData(historical.value);
      } else {
        console.error('Failed to fetch historical data:', historical.reason);
        // Fallback to mock data for chart display
        setHistoricalData(generateMockPriceData(symbol));
      }

      // Handle news data
      if (news.status === 'fulfilled') {
        setNewsData(news.value);
      } else {
        console.error('Failed to fetch news:', news.reason);
        // Fallback to mock news
        setNewsData(mockNews.map((item, index) => ({
          id: index.toString(),
          headline: item.title,
          summary: item.summary,
          url: item.link,
          source: item.source,
          publishedAt: item.time,
          sentiment: item.sentiment as 'positive' | 'negative' | 'neutral'
        })));
      }

      // Handle alerts data
      if (alerts.status === 'fulfilled') {
        setAlertsData(alerts.value);
      } else {
        console.error('Failed to fetch alerts:', alerts.reason);
        // Fallback to mock alerts
        setAlertsData(mockAlerts.map((item, index) => ({
          id: index.toString(),
          type: item.type as 'price_move' | 'volume_spike' | 'news_alert' | 'technical_signal',
          title: item.title,
          message: item.message,
          severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
          timestamp: item.time,
          symbol: symbol
        })));
      }

      // Handle sentiment data
      if (sentiment.status === 'fulfilled') {
        setSentimentData(sentiment.value);
      } else {
        console.error('Failed to fetch sentiment:', sentiment.reason);
        // Fallback sentiment data
        setSentimentData({
          bullishPercent: 72,
          bearishPercent: 28,
          sentiment: 'bullish'
        });
      }

    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchStockData(selectedTicker);
  }, [selectedTicker]);

  // Fallback to mock data for chart display
  const chartData = historicalData.length > 0 ? historicalData.map(point => ({
    date: point.date,
    price: point.close,
    volume: point.volume,
    high: point.high,
    low: point.low
  })) : generateMockPriceData(selectedTicker);

  const currentPrice = stockData ? {
    price: stockData.price,
    high: stockData.high,
    low: stockData.low,
    volume: stockData.volume
  } : chartData[chartData.length - 1];

  const previousPrice = stockData ? stockData.previousClose : chartData[chartData.length - 2]?.price || currentPrice.price;
  const priceChange = stockData ? stockData.change : currentPrice.price - previousPrice;
  const percentChange = stockData ? stockData.changePercent : (priceChange / previousPrice) * 100;

  // Enhanced search functionality
  const handleTickerSearch = async () => {
    if (tickerInput.trim()) {
      const symbol = tickerInput.toUpperCase();
      setSelectedTicker(symbol);
      setTickerInput('');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTickerInput(value);
    
    if (value.length > 1) {
      try {
        const suggestions = await stockService.searchStocks(value);
        setSearchSuggestions(suggestions.slice(0, 5)); // Limit to 5 suggestions
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSearchSuggestions([]);
      }
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    setSelectedTicker(symbol);
    setTickerInput('');
    setShowSuggestions(false);
  };

  const handleMarketChange = (market: string) => {
    setSelectedMarket(market);
    // Set default ticker for the selected market
    const defaultTickers = {
      'US': 'AAPL',
      'Indian': 'RELIANCE', 
      'Crypto': 'BTC'
    };
    setSelectedTicker(defaultTickers[market as keyof typeof defaultTickers] || 'AAPL');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTickerSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const getStockName = (symbol: string) => {
    const names: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'TSLA': 'Tesla Inc.',
      'BTC': 'Bitcoin',
      'NVDA': 'NVIDIA Corp.',
      'MSFT': 'Microsoft Corp.',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.'
    };
    return names[symbol] || `${symbol} Corporation`;
  };

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

      {/* Search & Entity Selection */}
      <section className="search-section">
        <div className="search-container">
          <div className="ticker-search">
            <div className="search-input-group">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder={marketConfig[selectedMarket as keyof typeof marketConfig]?.placeholder || "Enter ticker symbol"}
                  value={tickerInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => tickerInput.length > 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="ticker-input"
                />
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="search-suggestions">
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion.symbol)}
                      >
                        <span className="suggestion-symbol">{suggestion.symbol}</span>
                        <span className="suggestion-name">{suggestion.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={handleTickerSearch} 
                className="search-btn"
                title="Search"
                aria-label="Search for ticker"
              >
                <Icons.Search />
              </button>
            </div>
            <select 
              value={selectedMarket} 
              onChange={(e) => handleMarketChange(e.target.value)}
              className="market-dropdown"
              title="Select Market"
              aria-label="Select market type"
            >
              <option value="US">🇺🇸 US Market</option>
              <option value="Indian">🇮🇳 Indian Market</option>
              <option value="Crypto">₿ Cryptocurrency</option>
            </select>
          </div>
          <div className="current-selection">
            <span className="selected-ticker">{selectedTicker}</span>
            <span className="selected-market">
              ({marketConfig[selectedMarket as keyof typeof marketConfig]?.name})
            </span>
            <div className="market-examples">
              <span className="examples-label">Popular: </span>
              {marketConfig[selectedMarket as keyof typeof marketConfig]?.examples.map((example, index) => (
                <span 
                  key={example}
                  className="example-ticker"
                  onClick={() => handleSuggestionClick(example)}
                >
                  {example}{index < (marketConfig[selectedMarket as keyof typeof marketConfig]?.examples.length || 0) - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Three Column Layout */}
      <main className="home-main">
        <div className="main-grid">
          {/* Left Column - Stock Price & Chart */}
          <section className="stock-section">
            <div className="section-header">
              <h2>Stock Price & Chart</h2>
              <div className="chart-controls">
                <button 
                  className={`chart-toggle ${chartType === 'area' ? 'active' : ''}`}
                  onClick={() => setChartType('area')}
                >
                  Area
                </button>
                <button 
                  className={`chart-toggle ${chartType === 'line' ? 'active' : ''}`}
                  onClick={() => setChartType('line')}
                >
                  Line
                </button>
              </div>
            </div>
            
            <div className="stock-card">
              <div className="stock-header">
                <div className="stock-info">
                  <h3 className="stock-symbol">{selectedTicker}</h3>
                  <p className="stock-name">{getStockName(selectedTicker)}</p>
                </div>
                <div className="stock-price">
                  <span className="current-price">${currentPrice.price.toLocaleString()}</span>
                  <span className={`price-change ${priceChange >= 0 ? 'positive' : 'negative'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
                  </span>
                </div>
              </div>
              
              {/* Price Chart */}
              <div className="price-chart">
                <ResponsiveContainer width="100%" height={250}>
                  {chartType === 'area' ? (
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#888', fontSize: 12 }}
                        tickLine={{ stroke: '#333' }}
                      />
                      <YAxis 
                        tick={{ fill: '#888', fontSize: 12 }}
                        tickLine={{ stroke: '#333' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#87CEEB" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#87CEEB" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#87CEEB" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  ) : (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#888', fontSize: 12 }}
                        tickLine={{ stroke: '#333' }}
                      />
                      <YAxis 
                        tick={{ fill: '#888', fontSize: 12 }}
                        tickLine={{ stroke: '#333' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: '1px solid #333',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#87CEEB" 
                        strokeWidth={2}
                        dot={{ fill: '#87CEEB', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: '#87CEEB', strokeWidth: 2 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Volume Chart */}
              <div className="volume-chart">
                <h4 className="chart-title">Volume Trends</h4>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={chartData.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#888', fontSize: 10 }}
                      tickLine={{ stroke: '#333' }}
                    />
                    <YAxis 
                      tick={{ fill: '#888', fontSize: 10 }}
                      tickLine={{ stroke: '#333' }}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => [`${(value / 1000000).toFixed(1)}M`, 'Volume']}
                    />
                    <Bar 
                      dataKey="volume" 
                      fill="#87CEEB" 
                      opacity={0.7}
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="stock-stats">
                <div className="stat-item">
                  <span className="stat-label">High</span>
                  <span className="stat-value">${currentPrice.high.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low</span>
                  <span className="stat-value">${currentPrice.low.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Volume</span>
                  <span className="stat-value">{(currentPrice.volume / 1000000).toFixed(1)}M</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Market</span>
                  <span className="stat-value">{selectedMarket}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Middle Column - Enhanced News Feed */}
          <section className="news-section">
            <div className="section-header">
              <h2>News Feed</h2>
              {loading && <span className="loading-indicator">Loading...</span>}
            </div>
            <div className="news-feed">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              {newsData.map((news, index) => (
                <article key={news.id || index} className={`news-card ${news.sentiment || 'neutral'}`}>
                  <div className="news-header">
                    <span className="sentiment-icon">
                      {news.sentiment === 'positive' ? '😃' : 
                       news.sentiment === 'negative' ? '😡' : '😐'}
                    </span>
                    <div className="news-meta">
                      <span className="news-source">{news.source}</span>
                      <span className="news-time">
                        {news.publishedAt ? new Date(news.publishedAt).toLocaleString() : 'Unknown time'}
                      </span>
                    </div>
                  </div>
                  <div className="news-content">
                    <h4 className="news-title">{news.headline}</h4>
                    <p className="news-summary">{news.summary}</p>
                    <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-link">
                      Read more →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Right Column - Enhanced Alerts & Sentiment */}
          <section className="alerts-section">
            <div className="section-header">
              <h2>Alerts & Sentiment</h2>
            </div>
            
            <div className="alerts-container">
              <div className="sentiment-card">
                <h4>Market Sentiment</h4>
                <div className="sentiment-indicator">
                  <div className="sentiment-score bullish">
                    <span className="sentiment-value">
                      {sentimentData ? `${sentimentData.bullishPercent || 72}%` : '72%'}
                    </span>
                    <span className="sentiment-label">
                      {sentimentData ? sentimentData.sentiment || 'Bullish' : 'Bullish'}
                    </span>
                  </div>
                  <div className="sentiment-bar">
                    <div 
                      className="sentiment-fill" 
                      data-width={sentimentData ? sentimentData.bullishPercent || 72 : 72}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="alerts-list">
                <h4 className="alerts-title">Breaking News & Alerts</h4>
                {alertsData.map((alert, index) => (
                  <div key={alert.id || index} className={`alert-item ${alert.type}`}>
                    <div className="alert-indicator">
                      <span className="alert-emoji">
                        {alert.type === 'price_move' ? '🔴' :
                         alert.type === 'volume_spike' ? '🟡' :
                         alert.type === 'news_alert' ? '🔵' : '🟢'}
                      </span>
                    </div>
                    <div className="alert-content">
                      <h5>{alert.title}</h5>
                      <p>{alert.message}</p>
                      <span className="alert-time">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ai-prediction">
                <h4>AI Prediction</h4>
                <div className="prediction-card">
                  <div className="prediction-icon">
                    <Icons.TrendingUp />
                  </div>
                  <div className="prediction-details">
                    <span className="prediction-direction bullish">
                      {priceChange >= 0 ? 'Bullish' : 'Bearish'}
                    </span>
                    <span className="prediction-target">
                      Target: ${stockService.formatCurrency(currentPrice.price * 1.05).replace('$', '')}
                    </span>
                    <span className="prediction-timeframe">7-day forecast</span>
                  </div>
                  <div className="prediction-confidence">
                    <span className="confidence-label">Confidence</span>
                    <span className="confidence-value">
                      {sentimentData ? `${Math.min(sentimentData.bullishPercent + 15, 99)}%` : '87%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;