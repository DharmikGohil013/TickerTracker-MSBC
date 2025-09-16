import { ReactNode } from 'react';

// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  role: 'user' | 'premium' | 'admin';
  isEmailVerified: boolean;
  preferences: UserPreferences;
  subscription: Subscription;
  lastLogin?: string;
  createdAt: string;
}

export interface UserPreferences {
  defaultCurrency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'CAD' | 'AUD';
  watchlist: WatchlistItem[];
  portfolios: Portfolio[];
  notifications: NotificationSettings;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface WatchlistItem {
  symbol: string;
  addedAt: string;
}

export interface Portfolio {
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  priceAlerts: boolean;
  portfolioUpdates: boolean;
  marketNews: boolean;
  emailNotifications: boolean;
}

export interface Subscription {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

// Authentication Forms
export interface LoginForm {
  identifier: string; // email or username
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  password: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

// Stock Market Types
export interface StockData {
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

export interface MarketData {
  symbol: string;
  exchange: string;
  currency: string;
  country: string;
  sector?: string;
  industry?: string;
}

export interface PriceHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
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
  relatedSymbols: string[];
}

export interface SentimentAnalysis {
  symbol: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  sources: {
    news: number;
    social: number;
    analyst: number;
  };
  lastUpdated: string;
}

// Chart and Visualization Types
export interface ChartDataPoint {
  x: string | number;
  y: number;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
}

// Market Analysis Types
export interface MarketSummary {
  indices: {
    [key: string]: {
      value: number;
      change: number;
      changePercent: number;
    };
  };
  topMovers: {
    gainers: StockData[];
    losers: StockData[];
    mostActive: StockData[];
  };
  marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours';
  lastUpdated: string;
}

export interface AnalysisReport {
  symbol: string;
  recommendation: 'strong-buy' | 'buy' | 'hold' | 'sell' | 'strong-sell';
  targetPrice: number;
  currentPrice: number;
  upside: number;
  confidence: number;
  keyPoints: string[];
  risks: string[];
  opportunities: string[];
  technicalAnalysis: TechnicalIndicator[];
  fundamentalData: {
    [key: string]: number | string;
  };
  generatedAt: string;
}

// UI and Component Types
export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  content: ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: 'stock' | 'etf' | 'crypto' | 'forex';
  country?: string;
}

// Error Types
export interface AppError {
  message: string;
  status?: number;
  code?: string;
}

// Application State Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface MarketState {
  watchlist: StockData[];
  marketSummary: MarketSummary | null;
  selectedStock: StockData | null;
  priceHistory: PriceHistory[];
  news: NewsItem[];
  sentiment: SentimentAnalysis | null;
  isLoading: boolean;
  error: string | null;
}