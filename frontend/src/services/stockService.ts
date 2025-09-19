import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`API response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`API error from ${error.config?.url}:`, error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Stock data interfaces
interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  marketCap?: number;
  lastUpdated: string;
}

interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentimentScore?: number;
  image?: string;
}

interface Alert {
  id: string;
  type: 'price_move' | 'volume_spike' | 'news_alert' | 'technical_signal';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  symbol: string;
  data?: any;
}

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

interface MarketStatus {
  market: string;
  status: 'open' | 'closed' | 'pre_market' | 'after_hours';
  nextOpenTime?: string;
  nextCloseTime?: string;
}

// Stock Service Class
class StockService {
  /**
   * Get real-time stock data for a symbol
   */
  async getStockData(symbol: string): Promise<StockData> {
    try {
      const response = await api.get(`/stock/${symbol.toUpperCase()}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      
      // Return mock data as fallback
      const mockPrice = symbol === 'AAPL' ? 175 : symbol === 'TSLA' ? 250 : symbol === 'BTC' ? 43000 : 100;
      const change = (Math.random() - 0.5) * 20;
      return {
        symbol: symbol.toUpperCase(),
        price: mockPrice,
        change: change,
        changePercent: (change / mockPrice) * 100,
        high: mockPrice * 1.02,
        low: mockPrice * 0.98,
        open: mockPrice * 0.99,
        previousClose: mockPrice - change,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Get historical stock data
   */
  async getHistoricalData(symbol: string, period: string = '1M'): Promise<HistoricalDataPoint[]> {
    try {
      const response = await api.get(`/stock/${symbol.toUpperCase()}/history`, {
        params: { period }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      // Return mock historical data as fallback
      return this.generateMockHistoricalData(symbol);
    }
  }

  /**
   * Search for stocks by symbol or company name
   */
  async searchStocks(query: string): Promise<any[]> {
    try {
      const response = await api.get(`/stock/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching stocks with query ${query}:`, error);
      throw new Error(`Failed to search stocks`);
    }
  }

  /**
   * Get company profile information
   */
  async getCompanyProfile(symbol: string): Promise<any> {
    try {
      const response = await api.get(`/stock/${symbol.toUpperCase()}/profile`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching company profile for ${symbol}:`, error);
      throw new Error(`Failed to fetch company profile for ${symbol}`);
    }
  }

  /**
   * Get market status
   */
  async getMarketStatus(): Promise<MarketStatus> {
    try {
      const response = await api.get(`/stock/market-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market status:', error);
      throw new Error('Failed to fetch market status');
    }
  }

  /**
   * Get news for a specific symbol
   */
  async getSymbolNews(symbol: string, limit: number = 10): Promise<NewsItem[]> {
    try {
      const response = await api.get(`/news/${symbol.toUpperCase()}`, {
        params: { limit }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching news for ${symbol}:`, error);
      // Return mock news as fallback
      return this.generateMockNews(symbol);
    }
  }

  /**
   * Get social sentiment for a symbol
   */
  async getSocialSentiment(symbol: string): Promise<any> {
    try {
      const response = await api.get(`/news/${symbol.toUpperCase()}/sentiment`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sentiment for ${symbol}:`, error);
      throw new Error(`Failed to fetch sentiment for ${symbol}`);
    }
  }

  /**
   * Get trending news
   */
  async getTrendingNews(limit: number = 10): Promise<NewsItem[]> {
    try {
      const response = await api.get(`/news/trending`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending news:', error);
      throw new Error('Failed to fetch trending news');
    }
  }

  /**
   * Get alerts for a specific symbol
   */
  async getSymbolAlerts(symbol: string): Promise<Alert[]> {
    try {
      const response = await api.get(`/alerts/${symbol.toUpperCase()}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching alerts for ${symbol}:`, error);
      // Return mock alerts
      return this.generateMockAlerts(symbol);
    }
  }

  /**
   * Get market-wide alerts
   */
  async getMarketAlerts(limit: number = 20): Promise<Alert[]> {
    try {
      const response = await api.get(`/alerts/market`, {
        params: { limit }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching market alerts:', error);
      return this.generateMockAlerts('MARKET');
    }
  }

  /**
   * Get watchlist alerts
   */
  async getWatchlistAlerts(symbols: string[]): Promise<Alert[]> {
    try {
      const response = await api.get(`/alerts/watchlist`, {
        params: { symbols: symbols.join(',') }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist alerts:', error);
      throw new Error('Failed to fetch watchlist alerts');
    }
  }

  /**
   * Get watchlist data
   */
  async getWatchlist(): Promise<WatchlistItem[]> {
    try {
      const response = await api.get(`/auth/watchlist`);
      return response.data.watchlist?.symbols || [];
    } catch (error: any) {
      console.error('Error fetching watchlist:', error);
      // Return mock watchlist as fallback
      return [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175, change: 2.5, changePercent: 1.45, lastUpdated: new Date().toISOString() },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 250, change: -5.2, changePercent: -2.04, lastUpdated: new Date().toISOString() },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 310, change: 1.8, changePercent: 0.58, lastUpdated: new Date().toISOString() }
      ];
    }
  }

  /**
   * Add symbol to watchlist
   */
  async addToWatchlist(symbol: string): Promise<any> {
    try {
      const response = await api.post(`/auth/watchlist`, { symbol: symbol.toUpperCase() });
      return response.data;
    } catch (error: any) {
      console.error('Error adding to watchlist:', error);
      throw new Error('Failed to add to watchlist');
    }
  }

  /**
   * Remove symbol from watchlist
   */
  async removeFromWatchlist(symbol: string): Promise<any> {
    try {
      const response = await api.delete(`/auth/watchlist/${symbol.toUpperCase()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error removing from watchlist:', error);
      throw new Error('Failed to remove from watchlist');
    }
  }

  /**
   * Generate mock historical data for fallback
   */
  private generateMockHistoricalData(symbol: string): HistoricalDataPoint[] {
    const basePrice = symbol === 'AAPL' ? 175 : symbol === 'TSLA' ? 250 : symbol === 'BTC' ? 43000 : 100;
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < 30; i++) {
      const change = (Math.random() - 0.5) * (basePrice * 0.05);
      price += change;
      const dayPrice = parseFloat(price.toFixed(2));
      
      data.push({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open: parseFloat((dayPrice * 0.995).toFixed(2)),
        high: parseFloat((dayPrice * 1.02).toFixed(2)),
        low: parseFloat((dayPrice * 0.98).toFixed(2)),
        close: dayPrice,
        volume: Math.floor(Math.random() * 10000000) + 1000000
      });
    }
    return data;
  }

  /**
   * Generate mock news for fallback
   */
  private generateMockNews(symbol: string): NewsItem[] {
    const newsTemplates = [
      {
        headline: `${symbol} Reports Strong Quarterly Earnings`,
        summary: `${symbol} exceeded expectations with strong revenue growth and positive outlook for the next quarter.`,
        sentiment: 'positive' as const
      },
      {
        headline: `Market Volatility Affects ${symbol} Trading`,
        summary: `Recent market conditions have led to increased volatility in ${symbol} stock price.`,
        sentiment: 'neutral' as const
      },
      {
        headline: `Analysts Upgrade ${symbol} Price Target`,
        summary: `Leading analysts have raised their price targets for ${symbol} citing strong fundamentals.`,
        sentiment: 'positive' as const
      }
    ];

    return newsTemplates.map((template, index) => ({
      id: `mock-${symbol}-${index}`,
      headline: template.headline,
      summary: template.summary,
      url: '#',
      source: 'Market News',
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      sentiment: template.sentiment
    }));
  }

  /**
   * Generate mock alerts for fallback
   */
  private generateMockAlerts(symbol: string): Alert[] {
    return [
      {
        id: `alert-${symbol}-1`,
        type: 'price_move',
        title: 'Price Alert',
        message: `${symbol} price moved 5% in the last hour`,
        severity: 'medium',
        timestamp: new Date().toISOString(),
        symbol
      },
      {
        id: `alert-${symbol}-2`,
        type: 'volume_spike',
        title: 'Volume Alert',
        message: `${symbol} trading volume 3x above average`,
        severity: 'high',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        symbol
      }
    ];
  }

  /**
   * Format currency values
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  /**
   * Format percentage values
   */
  formatPercentage(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  }

  /**
   * Format large numbers (market cap, volume)
   */
  formatLargeNumber(value: number): string {
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
  }
}

// Export singleton instance
const stockService = new StockService();
export default stockService;

// Export types for use in components
export type {
  StockData,
  HistoricalDataPoint,
  NewsItem,
  Alert,
  MarketStatus
};