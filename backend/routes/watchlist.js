const express = require('express');
const router = express.Router();
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist
} = require('../controllers/watchlistController');

// Optional auth middleware - for now we'll use demo data
const optionalAuth = (req, res, next) => {
  // In a real app, this would verify JWT tokens
  // For now, we'll use a demo user
  req.user = { id: 'demo_user' };
  next();
};

/**
 * @route   GET /api/auth/watchlist
 * @desc    Get user's watchlist
 * @access  Public (with demo user)
 */
router.get('/watchlist', optionalAuth, getWatchlist);

/**
 * @route   POST /api/auth/watchlist
 * @desc    Add symbol to watchlist
 * @access  Public (with demo user)
 */
router.post('/watchlist', optionalAuth, addToWatchlist);

/**
 * @route   DELETE /api/auth/watchlist/:symbol
 * @desc    Remove symbol from watchlist
 * @access  Public (with demo user)
 */
router.delete('/watchlist/:symbol', optionalAuth, removeFromWatchlist);

/**
 * @route   DELETE /api/auth/watchlist
 * @desc    Clear entire watchlist
 * @access  Public (with demo user)
 */
router.delete('/watchlist', optionalAuth, clearWatchlist);

module.exports = router;