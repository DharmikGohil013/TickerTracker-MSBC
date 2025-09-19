const stockMarketService = require('../services/stockMarketService');

// @desc    Get stock quote
// @route   GET /api/stock/quote/:symbol
// @access  Private
const getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    console.log(`📈 Getting stock quote for ${symbol.toUpperCase()}`);
    const quote = await stockMarketService.getStockQuote(symbol.toUpperCase());
    
    res.json({
      success: true,
      data: quote,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get Stock Quote Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get comprehensive stock data
// @route   GET /api/stock/comprehensive/:symbol
// @access  Private
const getComprehensiveData = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    console.log(`📊 Getting comprehensive data for ${symbol.toUpperCase()}`);
    const data = await stockMarketService.getComprehensiveStockData(symbol.toUpperCase());
    
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get Comprehensive Data Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Search stocks
// @route   GET /api/stock/search?q=query
// @access  Public
const searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter "q" is required'
      });
    }

    if (q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    console.log(`🔍 Searching stocks for: ${q}`);
    const results = await stockMarketService.searchStocks(q);
    
    res.json({
      success: true,
      data: results,
      count: results.length,
      query: q,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Search Stocks Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get daily time series
// @route   GET /api/stock/timeseries/:symbol?outputSize=compact
// @access  Private
const getTimeSeries = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { outputSize } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    console.log(`📊 Getting time series for ${symbol.toUpperCase()}`);
    const data = await stockMarketService.getDailyTimeSeries(symbol.toUpperCase(), outputSize);
    
    res.json({
      success: true,
      data: data,
      count: data.length,
      symbol: symbol.toUpperCase(),
      outputSize: outputSize || 'compact',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get Time Series Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get company profile
// @route   GET /api/stock/profile/:symbol
// @access  Private
const getCompanyProfile = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    console.log(`🏢 Getting company profile for ${symbol.toUpperCase()}`);
    const profile = await stockMarketService.getCompanyProfile(symbol.toUpperCase());
    
    res.json({
      success: true,
      data: profile,
      symbol: symbol.toUpperCase(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get Company Profile Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get market news
// @route   GET /api/stock/news?category=general
// @access  Public
const getMarketNews = async (req, res) => {
  try {
    const { category } = req.query;
    
    console.log(`📰 Getting market news for category: ${category || 'general'}`);
    const news = await stockMarketService.getMarketNews(category);
    
    res.json({
      success: true,
      data: news,
      count: news.length,
      category: category || 'general',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get Market News Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get company news
// @route   GET /api/stock/news/:symbol?from=date&to=date
// @access  Private
const getCompanyNews = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { from, to } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    console.log(`📰 Getting company news for ${symbol.toUpperCase()}`);
    const news = await stockMarketService.getCompanyNews(symbol.toUpperCase(), from, to);
    
    res.json({
      success: true,
      data: news,
      count: news.length,
      symbol: symbol.toUpperCase(),
      dateRange: { from, to },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get Company News Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get market overview
// @route   GET /api/stock/overview
// @access  Public
const getMarketOverview = async (req, res) => {
  try {
    console.log('🌍 Getting market overview...');
    const overview = await stockMarketService.getMarketOverview();
    
    res.json({
      success: true,
      data: overview,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get Market Overview Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get Polygon stock details
// @route   GET /api/stock/polygon/:symbol
// @access  Private
const getPolygonDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    console.log(`📊 Getting Polygon details for ${symbol.toUpperCase()}`);
    const details = await stockMarketService.getPolygonStockDetails(symbol.toUpperCase());
    
    res.json({
      success: true,
      data: details,
      symbol: symbol.toUpperCase(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get Polygon Details Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Get Polygon aggregates (OHLC data)
// @route   GET /api/stock/aggregates/:symbol?timespan=day&from=date&to=date
// @access  Private
const getPolygonAggregates = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timespan, from, to } = req.query;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Stock symbol is required'
      });
    }

    console.log(`📊 Getting Polygon aggregates for ${symbol.toUpperCase()}`);
    const aggregates = await stockMarketService.getPolygonAggregates(
      symbol.toUpperCase(), 
      timespan, 
      from, 
      to
    );
    
    res.json({
      success: true,
      data: aggregates,
      count: aggregates.length,
      symbol: symbol.toUpperCase(),
      timespan: timespan || 'day',
      dateRange: { from, to },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get Polygon Aggregates Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// @desc    Test all APIs
// @route   GET /api/stock/test
// @access  Private
const testAllAPIs = async (req, res) => {
  try {
    console.log('🧪 Testing all Stock Market APIs...');
    const testResults = await stockMarketService.testAllAPIs();
    
    const workingAPIs = Object.values(testResults).filter(result => result.status === 'success').length;
    const totalAPIs = Object.keys(testResults).length;
    
    res.json({
      success: true,
      message: `API Test Complete: ${workingAPIs}/${totalAPIs} APIs working`,
      data: testResults,
      summary: {
        workingAPIs,
        totalAPIs,
        healthScore: Math.round((workingAPIs / totalAPIs) * 100)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Test APIs Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Legacy endpoints for backward compatibility
const getStockData = getStockQuote;
const getStockHistory = getTimeSeries;

module.exports = {
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
};