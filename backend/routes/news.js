const express = require('express');
const router = express.Router();
const {
  getSymbolNews,
  getMarketNews,
  getSocialSentiment,
  getTrendingNews
} = require('../controllers/newsController');

// @route   GET /api/news
// @desc    Get general market news
// @access  Public
router.get('/', getMarketNews);

// @route   GET /api/news/trending
// @desc    Get trending news and stocks
// @access  Public
router.get('/trending', getTrendingNews);

// @route   GET /api/news/:symbol
// @desc    Get news for a specific symbol
// @access  Public
router.get('/:symbol', getSymbolNews);

// @route   GET /api/news/:symbol/sentiment
// @desc    Get social sentiment for a symbol
// @access  Public
router.get('/:symbol/sentiment', getSocialSentiment);

module.exports = router;