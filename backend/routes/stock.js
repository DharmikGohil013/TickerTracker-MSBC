const express = require('express');
const router = express.Router();
const {
  getStockData,
  getStockHistory,
  searchStocks,
  getCompanyProfile,
  getMarketStatus
} = require('../controllers/stockController');

// @route   GET /api/stock/search
// @desc    Search for stocks/symbols
// @access  Public
router.get('/search', searchStocks);

// @route   GET /api/stock/market-status
// @desc    Get market status
// @access  Public
router.get('/market-status', getMarketStatus);

// @route   GET /api/stock/:symbol
// @desc    Get stock quote and basic info
// @access  Public
router.get('/:symbol', getStockData);

// @route   GET /api/stock/:symbol/history
// @desc    Get historical stock data
// @access  Public
router.get('/:symbol/history', getStockHistory);

// @route   GET /api/stock/:symbol/profile
// @desc    Get company profile/details
// @access  Public
router.get('/:symbol/profile', getCompanyProfile);

module.exports = router;