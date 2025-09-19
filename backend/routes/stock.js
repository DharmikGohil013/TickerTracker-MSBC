const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  getStockQuote,
  getComprehensiveData,
  searchStocks,
  getTimeSeries,
  getCompanyProfile,
  getMarketNews,
  getCompanyNews,
  getMarketOverview,
  getPolygonDetails,
  getPolygonAggregates,
  testAllAPIs,
  // Legacy compatibility
  getStockData,
  getStockHistory
} = require('../controllers/stockController');
const { protect } = require('../middleware/auth');

// Rate limiting for stock API calls
const stockRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many stock API requests, please try again later.'
  }
});

// Apply rate limiting to all stock routes
router.use(stockRateLimit);

// ===================
// PUBLIC ROUTES
// ===================

// Stock search - public access for basic search functionality
router.get('/search', searchStocks);

// Market news - public access
router.get('/news', getMarketNews);

// Market overview - public access
router.get('/overview', getMarketOverview);

// ===================
// PROTECTED ROUTES
// ===================

// Apply authentication to all routes below
router.use(protect);

// Stock quotes and data
router.get('/quote/:symbol', getStockQuote);
router.get('/comprehensive/:symbol', getComprehensiveData);

// Time series data
router.get('/timeseries/:symbol', getTimeSeries);

// Company information
router.get('/profile/:symbol', getCompanyProfile);

// Company-specific news
router.get('/news/:symbol', getCompanyNews);

// Polygon-specific endpoints
router.get('/polygon/:symbol', getPolygonDetails);
router.get('/aggregates/:symbol', getPolygonAggregates);

// API testing endpoint
router.get('/test', testAllAPIs);

// ===================
// LEGACY ROUTES (for backward compatibility)
// ===================

// Legacy stock data endpoint
router.get('/:symbol', getStockData);

// Legacy stock history endpoint
router.get('/:symbol/history', getStockHistory);

module.exports = router;