const AlphaVantageService = require('../services/alphaVantageService');
const FinnhubService = require('../services/finnhubService');
const PolygonService = require('../services/polygonService');

const alphaVantage = new AlphaVantageService();
const finnhub = new FinnhubService();
const polygon = new PolygonService();

// @desc    Get stock quote and basic info
// @route   GET /api/stock/:symbol
// @access  Public
const getStockData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { market = 'US' } = req.query;

    console.log(`Fetching stock data for ${symbol} in ${market} market`);

    let stockData = {};
    let error = null;

    // Try different APIs based on market type
    if (market.toLowerCase() === 'crypto') {
      try {
        // For crypto, try Alpha Vantage first
        stockData = await alphaVantage.getCryptoQuote(symbol, 'USD');
        stockData.market = 'Crypto';
      } catch (cryptoError) {
        console.log('Alpha Vantage crypto failed, trying Polygon...');
        try {
          const cryptoQuote = await polygon.getCryptoQuote(symbol, 'USD');
          stockData = {
            symbol: `${symbol}/USD`,
            currentPrice: cryptoQuote.ask || cryptoQuote.bid,
            market: 'Crypto',
            lastRefreshed: cryptoQuote.timestamp
          };
        } catch (polygonError) {
          error = 'Failed to fetch cryptocurrency data';
        }
      }
    } else {
      // For US stocks, try Alpha Vantage first, then Finnhub
      try {
        stockData = await alphaVantage.getQuote(symbol);
        stockData.market = market;
      } catch (alphaError) {
        console.log('Alpha Vantage failed, trying Finnhub...');
        try {
          const finnhubQuote = await finnhub.getQuote(symbol);
          stockData = {
            symbol: symbol,
            currentPrice: finnhubQuote.currentPrice,
            change: finnhubQuote.change,
            changePercent: finnhubQuote.changePercent,
            high: finnhubQuote.high,
            low: finnhubQuote.low,
            open: finnhubQuote.open,
            previousClose: finnhubQuote.previousClose,
            market: market
          };
        } catch (finnhubError) {
          error = 'Failed to fetch stock data from all sources';
        }
      }
    }

    if (error) {
      return res.status(404).json({
        success: false,
        message: error
      });
    }

    res.json({
      success: true,
      data: stockData
    });

  } catch (error) {
    console.error('Stock Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stock data'
    });
  }
};

// @desc    Get historical stock data
// @route   GET /api/stock/:symbol/history
// @access  Public
const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { market = 'US', period = '30', interval = 'daily' } = req.query;

    console.log(`Fetching ${period} days of ${interval} history for ${symbol} in ${market} market`);

    let historyData = [];
    let error = null;

    if (market.toLowerCase() === 'crypto') {
      try {
        historyData = await alphaVantage.getCryptoDailyHistory(symbol, 'USD');
      } catch (cryptoError) {
        console.log('Alpha Vantage crypto history failed, trying Polygon...');
        try {
          const fromDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const toDate = new Date().toISOString().split('T')[0];
          historyData = await polygon.getCryptoAggregates(fromDate, toDate, `X:${symbol}USD`);
        } catch (polygonError) {
          error = 'Failed to fetch crypto historical data';
        }
      }
    } else {
      try {
        if (interval === 'intraday') {
          historyData = await alphaVantage.getIntradayData(symbol, '5min');
        } else {
          historyData = await alphaVantage.getDailyHistory(symbol, 'compact');
        }
      } catch (alphaError) {
        console.log('Alpha Vantage history failed, trying Finnhub...');
        try {
          const resolution = interval === 'intraday' ? '5' : 'D';
          const fromTimestamp = Math.floor((Date.now() - parseInt(period) * 24 * 60 * 60 * 1000) / 1000);
          const toTimestamp = Math.floor(Date.now() / 1000);
          historyData = await finnhub.getCandles(symbol, resolution, fromTimestamp, toTimestamp);
        } catch (finnhubError) {
          error = 'Failed to fetch historical data from all sources';
        }
      }
    }

    if (error) {
      return res.status(404).json({
        success: false,
        message: error
      });
    }

    // Limit data to requested period
    const limitedData = historyData.slice(-parseInt(period));

    res.json({
      success: true,
      data: limitedData,
      meta: {
        symbol: symbol,
        market: market,
        period: period,
        interval: interval,
        count: limitedData.length
      }
    });

  } catch (error) {
    console.error('Stock History Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching historical data'
    });
  }
};

// @desc    Search for stocks/symbols
// @route   GET /api/stock/search
// @access  Public
const searchStocks = async (req, res) => {
  try {
    const { q: query, market = 'US' } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    console.log(`Searching for stocks: ${query} in ${market} market`);

    let searchResults = [];

    try {
      // Use Alpha Vantage for search
      searchResults = await alphaVantage.searchSymbols(query);
      
      // Filter by market if needed
      if (market !== 'ALL') {
        searchResults = searchResults.filter(result => {
          if (market === 'US') return result.region === 'United States';
          if (market === 'Indian') return result.region === 'India';
          return true; // For crypto or other markets
        });
      }
    } catch (searchError) {
      console.log('Alpha Vantage search failed, trying Polygon...');
      try {
        const polygonResults = await polygon.searchTickers(query, null, market === 'US' ? 'stocks' : null);
        searchResults = polygonResults.map(ticker => ({
          symbol: ticker.ticker,
          name: ticker.name,
          type: ticker.type,
          region: ticker.locale === 'us' ? 'United States' : ticker.locale,
          currency: ticker.currencyName || 'USD'
        }));
      } catch (polygonError) {
        console.error('All search services failed');
      }
    }

    res.json({
      success: true,
      data: searchResults.slice(0, 20), // Limit to 20 results
      meta: {
        query: query,
        market: market,
        count: Math.min(searchResults.length, 20)
      }
    });

  } catch (error) {
    console.error('Stock Search Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching stocks'
    });
  }
};

// @desc    Get company profile/details
// @route   GET /api/stock/:symbol/profile
// @access  Public
const getCompanyProfile = async (req, res) => {
  try {
    const { symbol } = req.params;

    console.log(`Fetching company profile for ${symbol}`);

    let profileData = {};

    try {
      // Try Finnhub first for company profile
      profileData = await finnhub.getCompanyProfile(symbol);
    } catch (finnhubError) {
      console.log('Finnhub profile failed, trying Polygon...');
      try {
        const polygonProfile = await polygon.getTickerDetails(symbol);
        profileData = {
          symbol: polygonProfile.ticker,
          name: polygonProfile.name,
          exchange: polygonProfile.primaryExchange,
          marketCap: polygonProfile.marketCap,
          description: polygonProfile.description,
          weburl: polygonProfile.homepage_url,
          country: polygonProfile.locale,
          currency: polygonProfile.currencyName
        };
      } catch (polygonError) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found'
        });
      }
    }

    res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Company Profile Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching company profile'
    });
  }
};

// @desc    Get market status
// @route   GET /api/stock/market-status
// @access  Public
const getMarketStatus = async (req, res) => {
  try {
    console.log('Fetching market status');

    let marketStatus = {};

    try {
      marketStatus = await polygon.getMarketStatus();
    } catch (error) {
      // Fallback market status
      const now = new Date();
      const isWeekend = now.getDay() === 0 || now.getDay() === 6;
      const hour = now.getHours();
      const isMarketHours = hour >= 9 && hour <= 16; // 9 AM to 4 PM

      marketStatus = {
        market: isWeekend || !isMarketHours ? 'closed' : 'open',
        serverTime: now.toISOString(),
        exchanges: {
          nasdaq: isWeekend || !isMarketHours ? 'closed' : 'open',
          nyse: isWeekend || !isMarketHours ? 'closed' : 'open'
        }
      };
    }

    res.json({
      success: true,
      data: marketStatus
    });

  } catch (error) {
    console.error('Market Status Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching market status'
    });
  }
};

module.exports = {
  getStockData,
  getStockHistory,
  searchStocks,
  getCompanyProfile,
  getMarketStatus
};