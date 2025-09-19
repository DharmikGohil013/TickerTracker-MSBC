import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { StockService, StockQuote, NewsItem, TimeSeriesData, CompanyProfile } from '../../services/stockService';
import './Market.css';

const StockDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol') || 'AAPL';
  
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [historicalData, setHistoricalData] = useState<TimeSeriesData[]>([]);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('1y');
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data generation
  const generateMockHistoricalData = (symbol: string, period: string) => {
    const basePrice = symbol === 'AAPL' ? 175 : symbol === 'TSLA' ? 250 : 100;
    const periods = { '1d': 1, '5d': 5, '1m': 30, '3m': 90, '6m': 180, '1y': 365, '2y': 730 };
    const days = periods[period as keyof typeof periods] || 365;
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < Math.min(days, 200); i++) {
      const change = (Math.random() - 0.5) * (basePrice * 0.03);
      price += change;
      data.push({
        timestamp: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString(),
        open: parseFloat((price * 0.995).toFixed(2)),
        high: parseFloat((price * 1.02).toFixed(2)),
        low: parseFloat((price * 0.98).toFixed(2)),
        close: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 1000000
      });
    }
    return data;
  };

  // Fetch all stock data
  const fetchStockData = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [quote, profile, historical, news] = await Promise.allSettled([
        StockService.getStockQuote(symbol),
        StockService.getCompanyProfile(symbol),
        StockService.getTimeSeries(symbol, selectedPeriod),
        StockService.getCompanyNews(symbol, 5)
      ]);

      // Handle quote data
      if (quote.status === 'fulfilled') {
        setStockData(quote.value);
      } else {
        console.error('Failed to fetch quote:', quote.reason);
        // Mock stock data
        setStockData({
          symbol: symbol,
          name: getCompanyName(symbol),
          price: symbol === 'AAPL' ? 175.50 : symbol === 'TSLA' ? 255.75 : 100.00,
          change: (Math.random() - 0.5) * 10,
          changePercent: (Math.random() - 0.5) * 5,
          volume: Math.floor(Math.random() * 50000000) + 10000000,
          marketCap: 2000000000000,
          peRatio: 25.5,
          high52Week: symbol === 'AAPL' ? 185.00 : symbol === 'TSLA' ? 280.00 : 110.00,
          low52Week: symbol === 'AAPL' ? 155.00 : symbol === 'TSLA' ? 220.00 : 85.00,
          lastUpdated: new Date().toISOString()
        });
      }

      // Handle profile data
      if (profile.status === 'fulfilled') {
        setCompanyProfile(profile.value);
      } else {
        console.error('Failed to fetch profile:', profile.reason);
        // Mock company profile
        setCompanyProfile({
          symbol: symbol,
          name: getCompanyName(symbol),
          description: `${getCompanyName(symbol)} is a leading technology company that designs, manufactures, and markets consumer electronics, computer software, and online services worldwide.`,
          sector: 'Technology',
          industry: 'Consumer Electronics',
          country: 'United States',
          website: `https://www.${symbol.toLowerCase()}.com`,
          employees: 150000,
          founded: '1976',
          headquarters: 'Cupertino, CA'
        });
      }

      // Handle historical data
      if (historical.status === 'fulfilled') {
        setHistoricalData(historical.value);
      } else {
        console.error('Failed to fetch historical data:', historical.reason);
        setHistoricalData(generateMockHistoricalData(symbol, selectedPeriod));
      }

      // Handle news data
      if (news.status === 'fulfilled') {
        setNewsData(news.value);
      } else {
        console.error('Failed to fetch news:', news.reason);
        setNewsData([]);
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCompanyName = (symbol: string): string => {
    const names: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'TSLA': 'Tesla Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'NVDA': 'NVIDIA Corporation',
      'META': 'Meta Platforms Inc.'
    };
    return names[symbol] || `${symbol} Corporation`;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Load data when symbol or period changes
  useEffect(() => {
    fetchStockData(symbol);
  }, [symbol, selectedPeriod]);

  const chartData = historicalData.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString(),
    price: point.close,
    volume: point.volume
  }));

  if (loading) {
    return (
      <div className="market-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="market-page">
        <div className="error-message">
          <h3>Error Loading Stock Data</h3>
          <p>{error}</p>
          <button 
            className="search-button" 
            style={{ marginTop: '1rem' }}
            onClick={() => fetchStockData(symbol)}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="market-page">
      <div className="market-container">
        {/* Stock Header */}
        <div className="market-header">
          <h1 className="market-title">{stockData?.symbol} - {stockData?.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff' }}>
              {stockData ? formatCurrency(stockData.price) : '--'}
            </div>
            {stockData && (
              <div className={`index-change ${stockData.change >= 0 ? 'positive' : 'negative'}`}>
                <span className="change-arrow">
                  {stockData.change >= 0 ? '↗' : '↘'}
                </span>
                <span>
                  {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Chart Section */}
          <div className="status-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff' }}>Price Chart</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className={`tab-button ${chartType === 'area' ? 'active' : ''}`}
                    onClick={() => setChartType('area')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    Area
                  </button>
                  <button 
                    className={`tab-button ${chartType === 'line' ? 'active' : ''}`}
                    onClick={() => setChartType('line')}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    Line
                  </button>
                </div>
              </div>
            </div>

            {/* Period Selection */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {['1d', '5d', '1m', '3m', '6m', '1y', '2y'].map((period) => (
                <button 
                  key={period}
                  className={`tab-button ${selectedPeriod === period ? 'active' : ''}`}
                  onClick={() => setSelectedPeriod(period)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  {period.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
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
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#667eea" 
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
                      stroke="#667eea" 
                      strokeWidth={2}
                      dot={{ fill: '#667eea', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: '#667eea', strokeWidth: 2 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="status-card">
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem' }}>
                Key Statistics
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div className="stat-item">
                  <div className="stat-label">Market Cap</div>
                  <div className="stat-value">
                    {stockData?.marketCap ? formatLargeNumber(stockData.marketCap) : '--'}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Volume</div>
                  <div className="stat-value">
                    {stockData ? (stockData.volume / 1000000).toFixed(1) + 'M' : '--'}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">P/E Ratio</div>
                  <div className="stat-value">
                    {stockData?.peRatio ? stockData.peRatio.toFixed(2) : '--'}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">52W High</div>
                  <div className="stat-value">
                    {stockData?.high52Week ? formatCurrency(stockData.high52Week) : '--'}
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">52W Low</div>
                  <div className="stat-value">
                    {stockData?.low52Week ? formatCurrency(stockData.low52Week) : '--'}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            {companyProfile && (
              <div className="status-card">
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem' }}>
                  Company Info
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#a0a0a0' }}>Sector: </span>
                    <span style={{ color: '#ffffff' }}>{companyProfile.sector}</span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a0a0' }}>Industry: </span>
                    <span style={{ color: '#ffffff' }}>{companyProfile.industry}</span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a0a0' }}>Employees: </span>
                    <span style={{ color: '#ffffff' }}>{companyProfile.employees?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a0a0' }}>Founded: </span>
                    <span style={{ color: '#ffffff' }}>{companyProfile.founded}</span>
                  </div>
                  <div>
                    <span style={{ color: '#a0a0a0' }}>HQ: </span>
                    <span style={{ color: '#ffffff' }}>{companyProfile.headquarters}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Company Description */}
        {companyProfile && (
          <div className="status-card" style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem' }}>
              About {companyProfile.name}
            </h3>
            <p style={{ color: '#a0a0a0', lineHeight: '1.6' }}>
              {companyProfile.description}
            </p>
          </div>
        )}

        {/* Recent News */}
        {newsData.length > 0 && (
          <div className="status-card">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', marginBottom: '2rem' }}>
              Recent News
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {newsData.map((news) => (
                <div 
                  key={news.id} 
                  style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => window.open(news.url, '_blank')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '600', flex: 1, marginRight: '1rem' }}>
                      {news.title}
                    </h4>
                    <span style={{ color: '#888888', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {formatTimeAgo(news.publishedAt)}
                    </span>
                  </div>
                  <p style={{ color: '#a0a0a0', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                    {news.summary}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#888888', fontSize: '0.8rem' }}>{news.source}</span>
                    {news.sentiment && (
                      <span className={`sentiment-badge sentiment-${news.sentiment}`}>
                        {news.sentiment}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetail;