import React, { useState, useEffect } from 'react';
import { StockService, NewsItem } from '../../services/stockService';
import './News.css';

type NewsTab = 'market' | 'company' | 'regional';
type Region = 'US' | 'India';

interface TrendingStock {
  symbol: string;
  change: number;
  changePercent: number;
}

const News: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NewsTab>('market');
  const [selectedRegion, setSelectedRegion] = useState<Region>('US');
  const [marketNews, setMarketNews] = useState<NewsItem[]>([]);
  const [companyNews, setCompanyNews] = useState<NewsItem[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>(['AAPL', 'MSFT', 'GOOGL']);
  const [stockSearch, setStockSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock trending stocks data
  const trendingStocks: TrendingStock[] = [
    { symbol: 'AAPL', change: 2.45, changePercent: 1.4 },
    { symbol: 'TSLA', change: -5.67, changePercent: -2.1 },
    { symbol: 'MSFT', change: 3.21, changePercent: 0.9 },
    { symbol: 'NVDA', change: 12.34, changePercent: 4.2 },
    { symbol: 'GOOGL', change: -1.87, changePercent: -0.6 }
  ];

  // Fetch market news
  const fetchMarketNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const category = selectedRegion === 'US' ? 'general' : 'india';
      const news = await StockService.getMarketNews(category, 20);
      setMarketNews(news);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching market news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch company news for selected stocks
  const fetchCompanyNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allCompanyNews: NewsItem[] = [];
      
      for (const symbol of selectedStocks) {
        try {
          const news = await StockService.getCompanyNews(symbol, 5);
          allCompanyNews.push(...news);
        } catch (err) {
          console.error(`Error fetching news for ${symbol}:`, err);
        }
      }
      
      // Sort by published date
      allCompanyNews.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      
      setCompanyNews(allCompanyNews);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching company news:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle stock search and add
  const handleAddStock = () => {
    if (stockSearch.trim() && !selectedStocks.includes(stockSearch.toUpperCase())) {
      setSelectedStocks([...selectedStocks, stockSearch.toUpperCase()]);
      setStockSearch('');
    }
  };

  // Remove stock from selected list
  const handleRemoveStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(s => s !== symbol));
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Effect to fetch data when tab or region changes
  useEffect(() => {
    if (activeTab === 'market' || activeTab === 'regional') {
      fetchMarketNews();
    } else if (activeTab === 'company') {
      fetchCompanyNews();
    }
  }, [activeTab, selectedRegion]);

  // Effect to fetch company news when selected stocks change
  useEffect(() => {
    if (activeTab === 'company' && selectedStocks.length > 0) {
      fetchCompanyNews();
    }
  }, [selectedStocks]);

  const renderMarketNews = () => (
    <div className="market-news-layout">
      <div className="main-news-section">
        {marketNews.length > 0 && (
          <div className="featured-news">
            <div className="featured-news-item">
              <div className="featured-content">
                <h3>{marketNews[0].title}</h3>
                <p className="summary">{marketNews[0].summary}</p>
                <div className="featured-meta">
                  <span>{marketNews[0].source}</span>
                  <span>{formatTimeAgo(marketNews[0].publishedAt)}</span>
                  {marketNews[0].sentiment && (
                    <span className={`sentiment-badge sentiment-${marketNews[0].sentiment}`}>
                      {marketNews[0].sentiment}
                    </span>
                  )}
                </div>
              </div>
              {marketNews[0].imageUrl && (
                <img 
                  src={marketNews[0].imageUrl} 
                  alt={marketNews[0].title}
                  className="featured-image"
                />
              )}
            </div>
          </div>
        )}
        
        <div className="news-grid">
          {marketNews.slice(1).map((news) => (
            <div 
              key={news.id} 
              className="news-item"
              onClick={() => window.open(news.url, '_blank')}
            >
              <div className="news-meta">
                <span>{news.source}</span>
                <span>{formatTimeAgo(news.publishedAt)}</span>
              </div>
              <h4>{news.title}</h4>
              <p className="summary">{news.summary}</p>
              {news.sentiment && (
                <span className={`sentiment-badge sentiment-${news.sentiment}`}>
                  {news.sentiment}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="news-sidebar">
        <div className="sidebar-section">
          <h3>Trending Stocks</h3>
          {trendingStocks.map((stock) => (
            <div key={stock.symbol} className="trending-item">
              <span className="trending-symbol">{stock.symbol}</span>
              <span className={`trending-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
        
        <div className="sidebar-section">
          <h3>Market Status</h3>
          <div className="trending-item">
            <span>US Markets</span>
            <span className="positive">Open</span>
          </div>
          <div className="trending-item">
            <span>Indian Markets</span>
            <span className="negative">Closed</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompanyNews = () => (
    <div className="company-news-layout">
      <div className="stock-search-section">
        <h3>Select Stocks for News</h3>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
            value={stockSearch}
            onChange={(e) => setStockSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddStock()}
          />
          <button className="search-button" onClick={handleAddStock}>
            Add Stock
          </button>
        </div>
        
        <div className="selected-stocks">
          {selectedStocks.map((symbol) => (
            <div key={symbol} className="stock-chip">
              <span>{symbol}</span>
              <button 
                className="remove-stock"
                onClick={() => handleRemoveStock(symbol)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="news-grid">
        {companyNews.map((news) => (
          <div 
            key={news.id} 
            className="news-item"
            onClick={() => window.open(news.url, '_blank')}
          >
            <div className="news-meta">
              <span>{news.source}</span>
              <span>{formatTimeAgo(news.publishedAt)}</span>
            </div>
            <h4>{news.title}</h4>
            <p className="summary">{news.summary}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              {news.relatedSymbols && news.relatedSymbols.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {news.relatedSymbols.slice(0, 3).map((symbol) => (
                    <span key={symbol} className="stock-chip" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>
                      {symbol}
                    </span>
                  ))}
                </div>
              )}
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
  );

  const renderRegionalNews = () => (
    <div className="company-news-layout">
      <div className="region-toggle">
        <div className="toggle-container">
          <button 
            className={`toggle-option ${selectedRegion === 'US' ? 'active' : ''}`}
            onClick={() => setSelectedRegion('US')}
          >
            United States
          </button>
          <button 
            className={`toggle-option ${selectedRegion === 'India' ? 'active' : ''}`}
            onClick={() => setSelectedRegion('India')}
          >
            India
          </button>
        </div>
      </div>
      
      <div className="news-grid">
        {marketNews.map((news) => (
          <div 
            key={news.id} 
            className="news-item"
            onClick={() => window.open(news.url, '_blank')}
          >
            <div className="news-meta">
              <span>{news.source}</span>
              <span>{formatTimeAgo(news.publishedAt)}</span>
            </div>
            <h4>{news.title}</h4>
            <p className="summary">{news.summary}</p>
            {news.sentiment && (
              <span className={`sentiment-badge sentiment-${news.sentiment}`}>
                {news.sentiment}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <h3>Error Loading News</h3>
          <p>{error}</p>
          <button 
            className="search-button" 
            style={{ marginTop: '1rem' }}
            onClick={() => {
              if (activeTab === 'market' || activeTab === 'regional') {
                fetchMarketNews();
              } else {
                fetchCompanyNews();
              }
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    if (activeTab === 'company' && selectedStocks.length === 0) {
      return (
        <div className="empty-state">
          <h3>No Stocks Selected</h3>
          <p>Add some stock symbols to see company-specific news</p>
        </div>
      );
    }

    if ((activeTab === 'market' || activeTab === 'regional') && marketNews.length === 0) {
      return (
        <div className="empty-state">
          <h3>No News Available</h3>
          <p>No news articles found at the moment</p>
        </div>
      );
    }

    if (activeTab === 'company' && companyNews.length === 0) {
      return (
        <div className="empty-state">
          <h3>No Company News</h3>
          <p>No news found for the selected stocks</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'market':
        return renderMarketNews();
      case 'company':
        return renderCompanyNews();
      case 'regional':
        return renderRegionalNews();
      default:
        return null;
    }
  };

  return (
    <div className="news-page">
      <div className="news-container">
        <div className="news-header">
          <h1 className="news-title">Market News & Insights</h1>
          <p className="news-subtitle">
            Stay updated with the latest market trends, company news, and regional developments
          </p>
          
          <div className="news-tabs">
            <button 
              className={`tab-button ${activeTab === 'market' ? 'active' : ''}`}
              onClick={() => setActiveTab('market')}
            >
              Market News
            </button>
            <button 
              className={`tab-button ${activeTab === 'company' ? 'active' : ''}`}
              onClick={() => setActiveTab('company')}
            >
              Company News
            </button>
            <button 
              className={`tab-button ${activeTab === 'regional' ? 'active' : ''}`}
              onClick={() => setActiveTab('regional')}
            >
              Regional News
            </button>
          </div>
        </div>
        
        <div className="news-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default News;