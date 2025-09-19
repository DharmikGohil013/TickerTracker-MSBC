const express = require('express');
const router = express.Router();
const {
  getSymbolAlerts,
  getMarketAlerts,
  createPriceAlert,
  getWatchlistAlerts
} = require('../controllers/alertsController');

// @route   GET /api/alerts
// @desc    Get general market alerts
// @access  Public
router.get('/', getMarketAlerts);

// @route   GET /api/alerts/watchlist
// @desc    Get watchlist alerts
// @access  Private (would need authentication middleware)
router.get('/watchlist', getWatchlistAlerts);

// @route   GET /api/alerts/:symbol
// @desc    Get price movement alerts for a symbol
// @access  Public
router.get('/:symbol', getSymbolAlerts);

// @route   POST /api/alerts/:symbol
// @desc    Create a price alert for a user
// @access  Private (would need authentication middleware)
router.post('/:symbol', createPriceAlert);

module.exports = router;