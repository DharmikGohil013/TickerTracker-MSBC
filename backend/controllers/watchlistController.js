const { Watchlist } = require('../models');
const stockService = require('../services/alphaVantageService');

/**
 * Get user's watchlist
 */
const getWatchlist = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId || 'demo_user';
    
    let watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      // Create default watchlist for new users
      watchlist = await Watchlist.create({
        userId,
        symbols: ['AAPL', 'TSLA', 'MSFT', 'GOOGL'] // Default symbols
      });
    }

    // Fetch current prices for watchlist symbols
    const symbolsWithData = await Promise.allSettled(
      watchlist.symbols.map(async (symbol) => {
        try {
          const quote = await stockService.getQuote(symbol);
          return {
            symbol,
            name: getCompanyName(symbol),
            price: quote.price || 0,
            change: quote.change || 0,
            changePercent: quote.changePercent || 0,
            lastUpdated: quote.lastUpdated || new Date().toISOString()
          };
        } catch (error) {
          console.error(`Failed to fetch data for ${symbol}:`, error.message);
          return {
            symbol,
            name: getCompanyName(symbol),
            price: 0,
            change: 0,
            changePercent: 0,
            lastUpdated: new Date().toISOString(),
            error: 'Failed to fetch data'
          };
        }
      })
    );

    const symbols = symbolsWithData
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    res.json({
      success: true,
      watchlist: {
        userId,
        symbols,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist',
      error: error.message
    });
  }
};

/**
 * Add symbol to watchlist
 */
const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId || 'demo_user';
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol is required'
      });
    }

    const symbolUpper = symbol.toUpperCase();

    let watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      watchlist = await Watchlist.create({
        userId,
        symbols: [symbolUpper]
      });
    } else {
      if (!watchlist.symbols.includes(symbolUpper)) {
        watchlist.symbols.push(symbolUpper);
        await watchlist.save();
      }
    }

    // Fetch data for the added symbol
    try {
      const quote = await stockService.getQuote(symbolUpper);
      const symbolData = {
        symbol: symbolUpper,
        name: getCompanyName(symbolUpper),
        price: quote.price || 0,
        change: quote.change || 0,
        changePercent: quote.changePercent || 0,
        lastUpdated: quote.lastUpdated || new Date().toISOString()
      };

      res.json({
        success: true,
        message: `${symbolUpper} added to watchlist`,
        symbol: symbolData
      });
    } catch (error) {
      res.json({
        success: true,
        message: `${symbolUpper} added to watchlist`,
        symbol: {
          symbol: symbolUpper,
          name: getCompanyName(symbolUpper),
          price: 0,
          change: 0,
          changePercent: 0,
          lastUpdated: new Date().toISOString(),
          error: 'Failed to fetch current data'
        }
      });
    }

  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add symbol to watchlist',
      error: error.message
    });
  }
};

/**
 * Remove symbol from watchlist
 */
const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId || 'demo_user';
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol is required'
      });
    }

    const symbolUpper = symbol.toUpperCase();

    const watchlist = await Watchlist.findOne({ userId });
    
    if (!watchlist) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist not found'
      });
    }

    watchlist.symbols = watchlist.symbols.filter(s => s !== symbolUpper);
    await watchlist.save();

    res.json({
      success: true,
      message: `${symbolUpper} removed from watchlist`
    });

  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove symbol from watchlist',
      error: error.message
    });
  }
};

/**
 * Clear entire watchlist
 */
const clearWatchlist = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId || 'demo_user';

    await Watchlist.findOneAndUpdate(
      { userId },
      { symbols: [] },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Watchlist cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing watchlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear watchlist',
      error: error.message
    });
  }
};

/**
 * Helper function to get company names
 */
const getCompanyName = (symbol) => {
  const companyNames = {
    'AAPL': 'Apple Inc.',
    'TSLA': 'Tesla Inc.',
    'MSFT': 'Microsoft Corp.',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'NVDA': 'NVIDIA Corp.',
    'META': 'Meta Platforms Inc.',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'Binance Coin',
    'RELIANCE': 'Reliance Industries',
    'INFY': 'Infosys Limited',
    'TCS': 'Tata Consultancy Services',
    'BHARTIARTL': 'Bharti Airtel'
  };
  
  return companyNames[symbol] || `${symbol} Corp.`;
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist
};