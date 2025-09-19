// Backend Models for Stock API Integration
// This file serves as an index for all stock-related models

const Stock = require('./Stock');
const PriceHistory = require('./PriceHistory');
const News = require('./News');
const Alert = require('./Alert');
const Watchlist = require('./Watchlist');

module.exports = {
  Stock,
  PriceHistory,
  News,
  Alert,
  Watchlist
};

/**
 * Stock API Integration Models Documentation
 * ==========================================
 * 
 * These models are designed to work with live stock APIs like:
 * - Alpha Vantage
 * - Yahoo Finance API
 * - IEX Cloud
 * - Finnhub
 * - Polygon.io
 * - Indian Stock APIs (NSE/BSE)
 * - Cryptocurrency APIs (CoinGecko, CoinMarketCap)
 * 
 * Model Overview:
 * 
 * 1. Stock Model (Stock.js)
 * - Stores current stock information
 * - Real-time price data
 * - Market information (US, Indian, Crypto)
 * - Basic financial metrics
 * 
 * 2. PriceHistory Model (PriceHistory.js)
 * - Historical price data (OHLCV)
 * - Multiple timeframes (1min to 1month)
 * - Supports candlestick chart data
 * - Efficient querying for chart data
 * 
 * 3. News Model (News.js)
 * - Financial news articles
 * - Sentiment analysis
 * - Stock-specific news linking
 * - Category-based organization
 * 
 * 4. Alert Model (Alert.js)
 * - User-specific alerts
 * - Price movement alerts
 * - Volume spike alerts
 * - News and sentiment alerts
 * - Configurable thresholds
 * 
 * 5. Watchlist Model (Watchlist.js)
 * - User watchlists
 * - Stock tracking
 * - Alert preferences per stock
 * - Portfolio organization
 * 
 * Future API Integration:
 * 
 * Controllers to implement:
 * - stockController.js (real-time data fetching)
 * - newsController.js (news aggregation)
 * - alertController.js (alert management)
 * - watchlistController.js (watchlist operations)
 * 
 * Services to implement:
 * - stockDataService.js (API data fetching)
 * - sentimentAnalysisService.js (news sentiment)
 * - priceAlertService.js (price monitoring)
 * - technicalIndicatorService.js (TA calculations)
 * 
 * Routes to implement:
 * - /api/stocks (stock data endpoints)
 * - /api/stocks/:symbol/history (price history)
 * - /api/news (news endpoints)
 * - /api/alerts (alert management)
 * - /api/watchlists (watchlist management)
 */