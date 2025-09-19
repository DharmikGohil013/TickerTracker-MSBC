import { AxiosResponse } from 'axios';
import { api } from './apiClient';

// Types for stock data
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  high52Week?: number;
  low52Week?: number;
  lastUpdated: string;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  country?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  author?: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedSymbols?: string[];
  category?: string;
}

export interface MarketOverview {
  indices: {
    [key: string]: {
      value: number;
      change: number;
      changePercent: number;
    };
  };
  topMovers: {
    gainers: StockQuote[];
    losers: StockQuote[];
    mostActive: StockQuote[];
  };
  marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours';
  lastUpdated: string;
}

export interface CompanyProfile {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  country: string;
  website?: string;
  employees?: number;
  founded?: string;
  headquarters?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export class StockService {
  // Get real-time stock quote (Auth required)
  static async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const response: AxiosResponse<{ success: boolean; data: StockQuote }> = 
        await api.get(`/stock/quote/${symbol}`, {
          metadata: { loadingMessage: `Getting ${symbol} quote...` }
        });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to get quote for ${symbol}`);
    }
  }

  // Get comprehensive stock data (Auth required)
  static async getComprehensiveData(symbol: string): Promise<any> {
    try {
      const response: AxiosResponse<{ success: boolean; data: any }> = 
        await api.get(`/stock/comprehensive/${symbol}`, {
          metadata: { loadingMessage: `Loading ${symbol} data...` }
        });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to get data for ${symbol}`);
    }
  }

  // Search stocks (Public - no auth)
  static async searchStocks(query: string): Promise<StockSearchResult[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: StockSearchResult[] }> = 
        await api.get(`/stock/search?q=${encodeURIComponent(query)}`, {
          metadata: { 
            skipLoading: true // Skip loading for search as it should be fast
          }
        });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search stocks');
    }
  }

  // Get historical time series data (Auth required)
  static async getTimeSeries(symbol: string, period: string = '1y'): Promise<TimeSeriesData[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: TimeSeriesData[] }> = 
        await api.get(`/stock/timeseries/${symbol}?period=${period}`, {
          metadata: { loadingMessage: `Loading ${symbol} historical data...` }
        });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to get timeseries for ${symbol}`);
    }
  }

  // Get company profile (Auth required)
  static async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    try {
      const response: AxiosResponse<{ success: boolean; data: CompanyProfile }> = 
        await api.get(`/stock/profile/${symbol}`, {
          metadata: { loadingMessage: `Loading ${symbol} profile...` }
        });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to get profile for ${symbol}`);
    }
  }

  // Get general market news (Public - no auth)
  static async getMarketNews(category?: string, limit?: number): Promise<NewsItem[]> {
    try {
      let url = '/stock/news';
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (limit) params.append('limit', limit.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response: AxiosResponse<{ success: boolean; data: NewsItem[] }> = 
        await api.get(url, {
          metadata: { 
            loadingMessage: 'Loading market news...',
            skipLoading: false
          }
        });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get market news');
    }
  }

  // Get company-specific news (Auth required)
  static async getCompanyNews(symbol: string, limit?: number): Promise<NewsItem[]> {
    try {
      let url = `/stock/news/${symbol}`;
      if (limit) {
        url += `?limit=${limit}`;
      }

      const response: AxiosResponse<{ success: boolean; data: NewsItem[] }> = 
        await api.get(url, {
          metadata: { loadingMessage: `Loading ${symbol} news...` }
        });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || `Failed to get news for ${symbol}`);
    }
  }

  // Get market overview (Public - no auth)
  static async getMarketOverview(): Promise<MarketOverview> {
    try {
      const response: AxiosResponse<{ success: boolean; data: MarketOverview }> = 
        await api.get('/stock/overview', {
          metadata: { loadingMessage: 'Loading market overview...' }
        });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get market overview');
    }
  }

  // Test API health (Auth required)
  static async testAPI(): Promise<{ status: string; message: string }> {
    try {
      const response: AxiosResponse<{ success: boolean; data: any }> = 
        await api.get('/stock/test', {
          metadata: { loadingMessage: 'Testing API...' }
        });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to test API');
    }
  }

  // Utility functions
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  static formatPercentage(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  }

  static formatLargeNumber(value: number): string {
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