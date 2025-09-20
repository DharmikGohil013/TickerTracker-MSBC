import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/Icons/Icons';
import './FreeTrial.css';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  pe: number;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  time: string;
  impact: 'positive' | 'negative' | 'neutral';
  source: string;
}

interface ProfitLossData {
  investment: number;
  currentValue: number;
  profit: number;
  profitPercent: number;
  timeHeld: string;
  shares: number;
}

const FreeTrial: React.FC = () => {
  // Static stock data that updates with animation
  const [stockData, setStockData] = useState<StockData>({
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 456.78,
    change: 23.45,
    changePercent: 5.42,
    volume: 45678900,
    marketCap: '$1.12T',
    pe: 65.4
  });

  // Graph data points for animation
  const [graphData, setGraphData] = useState<number[]>([420, 425, 430, 435, 445, 450, 455, 456.78]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // News data that updates frequently
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 1,
      title: "NVIDIA Announces Revolutionary AI Chip Architecture",
      summary: "New GPU series shows 40% performance improvement over previous generation, driving stock surge",
      time: "2 minutes ago",
      impact: 'positive',
      source: 'TechCrunch'
    },
    {
      id: 2,
      title: "Strong Q3 Earnings Beat Analyst Expectations",
      summary: "Revenue up 68% year-over-year, driven by data center demand and AI adoption",
      time: "15 minutes ago", 
      impact: 'positive',
      source: 'Reuters'
    },
    {
      id: 3,
      title: "Tech Sector Shows Resilience Despite Market Volatility",
      summary: "Major tech stocks outperform broader market indices amid economic uncertainty",
      time: "32 minutes ago",
      impact: 'neutral',
      source: 'Bloomberg'
    },
    {
      id: 4,
      title: "AI Investment Continues to Drive Growth",
      summary: "Enterprise AI adoption accelerates across industries, boosting semiconductor demand",
      time: "1 hour ago",
      impact: 'positive',
      source: 'CNBC'
    }
  ]);

  // User investment tracking
  const [budget, setBudget] = useState<string>('');
  const [investmentData, setInvestmentData] = useState<ProfitLossData | null>(null);
  const [timeframe, setTimeframe] = useState<'short' | 'long'>('short');
  const [showResults, setShowResults] = useState(false);

  // Animation states
  const [isLive, setIsLive] = useState(true);
  const [newsUpdateCount, setNewsUpdateCount] = useState(0);

  // Animate stock price and graph
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate realistic price fluctuation
      const basePrice = 456.78;
      const volatility = 0.015; // 1.5% volatility
      const trend = Math.sin(Date.now() / 30000) * 0.005; // Slow trend component
      const noise = (Math.random() - 0.5) * volatility;
      const fluctuation = (trend + noise) * basePrice;
      
      const newPrice = Math.max(basePrice + fluctuation, 400); // Min price 400
      const change = newPrice - basePrice;
      const changePercent = (change / basePrice) * 100;

      setStockData(prev => ({
        ...prev,
        price: Number(newPrice.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 40000000 // Random volume
      }));

      // Update graph data
      setGraphData(prev => {
        const newData = [...prev.slice(-11), newPrice]; // Keep last 12 points
        return newData;
      });

      setCurrentTime(new Date());
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  // Update news periodically
  useEffect(() => {
    const newsItems = [
      {
        title: "Breaking: Major Partnership Announcement Expected",
        summary: "Industry leaders hint at groundbreaking AI collaboration that could reshape the market",
        impact: 'positive' as const,
        source: 'Market Watch'
      },
      {
        title: "Semiconductor Demand Reaches All-Time High",
        summary: "Global chip shortage drives unprecedented demand for AI processors and graphics cards",
        impact: 'positive' as const,
        source: 'Financial Times'
      },
      {
        title: "Federal Reserve Decision Impacts Tech Stocks",
        summary: "Interest rate considerations affecting technology sector valuations and growth projections",
        impact: 'neutral' as const,
        source: 'Wall Street Journal'
      },
      {
        title: "Institutional Investors Increase AI Holdings",
        summary: "Major funds allocate significant capital to artificial intelligence and semiconductor stocks",
        impact: 'positive' as const,
        source: "Investor's Business Daily"
      },
      {
        title: "Data Center Expansion Drives Revenue Growth",
        summary: "Cloud computing demand fuels massive infrastructure investments across the industry",
        impact: 'positive' as const,
        source: 'TechNews'
      }
    ];

    const newsInterval = setInterval(() => {
      const randomNews = newsItems[Math.floor(Math.random() * newsItems.length)];
      const newItem = {
        id: Date.now(),
        title: randomNews.title,
        summary: randomNews.summary,
        time: "Just now",
        impact: randomNews.impact,
        source: randomNews.source
      };

      setNews(prev => [newItem, ...prev.slice(0, 3)]);
      setNewsUpdateCount(prev => prev + 1);
    }, 8000); // Update news every 8 seconds

    return () => clearInterval(newsInterval);
  }, []);

  const handleBudgetSubmit = () => {
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) return;

    const investment = Number(budget);
    const shares = investment / stockData.price;
    
    // Simulate different scenarios based on timeframe
    let multiplier = 1;
    let timeHeld = '';
    
    if (timeframe === 'short') {
      // Short term: 1 day simulation with smaller but more frequent gains
      multiplier = 1 + (Math.random() * 0.08 - 0.02); // -2% to +6%
      timeHeld = '1 day';
    } else {
      // Long term: 30 days simulation with larger potential gains
      multiplier = 1 + (Math.random() * 0.35 - 0.05); // -5% to +30%
      timeHeld = '30 days';
    }
    
    const currentValue = investment * multiplier;
    const profit = currentValue - investment;
    const profitPercent = (profit / investment) * 100;
    
    setInvestmentData({
      investment,
      currentValue,
      profit,
      profitPercent,
      timeHeld,
      shares: Number(shares.toFixed(4))
    });
    
    setShowResults(true);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString();
  };

  return (
    <div className="free-trial-container">
      {/* Background Elements */}
      <div className="free-trial-background">
        <div className="free-trial-gradient"></div>
        <div className="free-trial-pattern"></div>
      </div>

      {/* Main Content */}
      <div className="free-trial-content">
        {/* Header */}
        <div className="free-trial-header">
          <div className="brand-logo">
            <Icons.Logo />
            <h1 className="brand-title">Stock Scope</h1>
          </div>
          <div className="trial-badge">
            <span className="badge-text">Free Trial Experience</span>
            <div className="badge-pulse"></div>
          </div>
          <h2 className="trial-title">Live Market Analysis Dashboard</h2>
          <p className="trial-subtitle">
            Experience real-time market data, AI-powered insights, and portfolio tracking
          </p>
        </div>

        {/* Stock Data Section */}
        <div className="stock-section">
          <div className="stock-card">
            <div className="stock-header">
              <div className="stock-info">
                <h3 className="stock-symbol">
                  {stockData.symbol}
                  <span className="live-indicator">
                    <div className="live-dot"></div>
                    LIVE
                  </span>
                </h3>
                <p className="stock-name">{stockData.name}</p>
                <div className="stock-exchange">NASDAQ</div>
              </div>
              <div className="stock-price-info">
                <span className="stock-price">{formatCurrency(stockData.price)}</span>
                <span className={`stock-change ${stockData.change >= 0 ? 'positive' : 'negative'}`}>
                  {stockData.change >= 0 ? '+' : ''}{formatCurrency(stockData.change)} 
                  ({stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                </span>
                <div className="last-updated">
                  Last updated: {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Live Graph */}
            <div className="stock-graph">
              <div className="graph-header">
                <h4>Real-Time Price Chart</h4>
                <div className="graph-timeframe">
                  <span className="timeframe-label">Live 5min</span>
                </div>
              </div>
              
              <div className="graph-container">
                <svg width="100%" height="140" viewBox="0 0 500 140">
                  <defs>
                    <linearGradient id="stockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#87CEEB" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#87CEEB" stopOpacity="0.05"/>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Grid lines */}
                  {[...Array(6)].map((_, i) => (
                    <line
                      key={i}
                      x1="40"
                      y1={20 + i * 20}
                      x2="460"
                      y2={20 + i * 20}
                      stroke="rgba(135, 206, 235, 0.1)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Price line */}
                  <path
                    d={`M ${graphData.map((price, index) => 
                      `${40 + (index * 420) / (graphData.length - 1)},${140 - 20 - ((price - Math.min(...graphData)) / (Math.max(...graphData) - Math.min(...graphData))) * 100}`
                    ).join(' L ')}`}
                    fill="none"
                    stroke="#87CEEB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />
                  
                  {/* Fill area */}
                  <path
                    d={`M 40,140 ${graphData.map((price, index) => 
                      `L ${40 + (index * 420) / (graphData.length - 1)},${140 - 20 - ((price - Math.min(...graphData)) / (Math.max(...graphData) - Math.min(...graphData))) * 100}`
                    ).join(' ')} L 460,140 Z`}
                    fill="url(#stockGradient)"
                  />
                  
                  {/* Data points */}
                  {graphData.map((price, index) => (
                    <circle
                      key={index}
                      cx={40 + (index * 420) / (graphData.length - 1)}
                      cy={140 - 20 - ((price - Math.min(...graphData)) / (Math.max(...graphData) - Math.min(...graphData))) * 100}
                      r={index === graphData.length - 1 ? "6" : "3"}
                      fill="#87CEEB"
                      className={index === graphData.length - 1 ? 'current-point' : ''}
                    />
                  ))}
                  
                  {/* Price labels */}
                  <text x="20" y="25" fill="#87CEEB" fontSize="10">${Math.max(...graphData).toFixed(0)}</text>
                  <text x="20" y="135" fill="#87CEEB" fontSize="10">${Math.min(...graphData).toFixed(0)}</text>
                </svg>
              </div>
              
              <div className="stock-metrics">
                <div className="metric">
                  <span className="metric-label">Volume</span>
                  <span className="metric-value">{formatNumber(stockData.volume)}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Market Cap</span>
                  <span className="metric-value">{stockData.marketCap}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">P/E Ratio</span>
                  <span className="metric-value">{stockData.pe}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">52W High</span>
                  <span className="metric-value">$502.15</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="news-section">
          <div className="section-header">
            <h3 className="section-title">
              <Icons.News />
              Live Market News
              {newsUpdateCount > 0 && (
                <span className="update-badge">{newsUpdateCount} new</span>
              )}
            </h3>
            <div className="news-frequency">
              <div className="frequency-indicator"></div>
              Updates every 8 seconds
            </div>
          </div>
          
          <div className="news-list">
            {news.map((item, index) => (
              <div key={item.id} className={`news-item ${index === 0 ? 'latest' : ''}`}>
                <div className={`news-indicator ${item.impact}`}></div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-source">{item.source}</span>
                    <span className="news-time">{item.time}</span>
                  </div>
                  <h4 className="news-title">{item.title}</h4>
                  <p className="news-summary">{item.summary}</p>
                </div>
                <div className={`impact-badge ${item.impact}`}>
                  {item.impact === 'positive' ? <Icons.TrendingUp /> : 
                   item.impact === 'negative' ? <Icons.TrendingDown /> : 
                   <Icons.Minus />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Tracker */}
        <div className="investment-section">
          <div className="section-header">
            <h3 className="section-title">
              <Icons.Calculator />
              Smart Investment Tracker
            </h3>
            <p className="section-subtitle">
              Enter your budget and see potential profit/loss over time
            </p>
          </div>
          
          <div className="investment-card">
            <div className="investment-inputs">
              <div className="input-group">
                <label htmlFor="budget">Investment Amount</label>
                <div className="input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="1000"
                    className="budget-input"
                    min="1"
                    max="1000000"
                  />
                </div>
                <span className="input-hint">Minimum: $1, Maximum: $1,000,000</span>
              </div>
              
              <div className="timeframe-selector">
                <label>Investment Period</label>
                <div className="timeframe-buttons">
                  <button
                    className={`timeframe-btn ${timeframe === 'short' ? 'active' : ''}`}
                    onClick={() => setTimeframe('short')}
                  >
                    <Icons.Clock />
                    Short Term
                    <span className="timeframe-desc">1 Day</span>
                  </button>
                  <button
                    className={`timeframe-btn ${timeframe === 'long' ? 'active' : ''}`}
                    onClick={() => setTimeframe('long')}
                  >
                    <Icons.Calendar />
                    Long Term
                    <span className="timeframe-desc">30 Days</span>
                  </button>
                </div>
              </div>
              
              <button 
                className="track-button" 
                onClick={handleBudgetSubmit}
                disabled={!budget || isNaN(Number(budget)) || Number(budget) <= 0}
              >
                <Icons.TrendingUp />
                Calculate Potential Returns
              </button>
            </div>

            {showResults && investmentData && (
              <div className="investment-results">
                <div className="results-header">
                  <div className="results-title">
                    <Icons.Target />
                    <h4>Investment Analysis</h4>
                  </div>
                  <div className="results-meta">
                    <span className="time-held">Simulated {investmentData.timeHeld}</span>
                    <span className="shares-owned">{investmentData.shares} shares</span>
                  </div>
                </div>
                
                <div className="results-grid">
                  <div className="result-item initial">
                    <span className="result-label">Initial Investment</span>
                    <span className="result-value">{formatCurrency(investmentData.investment)}</span>
                  </div>
                  <div className="result-item current">
                    <span className="result-label">Current Value</span>
                    <span className="result-value">{formatCurrency(investmentData.currentValue)}</span>
                  </div>
                  <div className="result-item profit-loss">
                    <span className="result-label">Profit/Loss</span>
                    <span className={`result-value ${investmentData.profit >= 0 ? 'profit' : 'loss'}`}>
                      {investmentData.profit >= 0 ? '+' : ''}{formatCurrency(investmentData.profit)}
                    </span>
                  </div>
                  <div className="result-item percentage">
                    <span className="result-label">Return %</span>
                    <span className={`result-value ${investmentData.profitPercent >= 0 ? 'profit' : 'loss'}`}>
                      {investmentData.profitPercent >= 0 ? '+' : ''}{investmentData.profitPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="results-insights">
                  <div className="insight">
                    <Icons.Info />
                    <span>
                      {investmentData.profit >= 0 
                        ? `Great choice! Your investment would have gained ${formatCurrency(investmentData.profit)} over ${investmentData.timeHeld}.`
                        : `This period shows a loss of ${formatCurrency(Math.abs(investmentData.profit))} over ${investmentData.timeHeld}. Market timing matters!`
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <div className="cta-text">
              <h3>Ready to Start Your Investment Journey?</h3>
              <p>Join thousands of smart investors using Stock Scope for data-driven trading decisions</p>
              <div className="cta-features">
                <div className="feature">
                  <Icons.Check />
                  <span>Real-time market data</span>
                </div>
                <div className="feature">
                  <Icons.Check />
                  <span>AI-powered insights</span>
                </div>
                <div className="feature">
                  <Icons.Check />
                  <span>Portfolio tracking</span>
                </div>
                <div className="feature">
                  <Icons.Check />
                  <span>Risk analysis</span>
                </div>
              </div>
            </div>
            <div className="cta-buttons">
              <Link to="/register" className="cta-button primary">
                <Icons.Star />
                Start Free Trial
              </Link>
              <Link to="/login" className="cta-button secondary">
                <Icons.User />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTrial;