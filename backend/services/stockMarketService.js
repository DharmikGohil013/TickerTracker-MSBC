const axios = require('axios');

class StockMarketService {
  constructor() {
    // Get API keys from environment variables
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
    this.finnhubKey = process.env.FINNHUB_API_KEY;
    this.polygonKey = process.env.POLYGON_API_KEY;
    
    // Base URLs for each API
    this.alphaVantageUrl = 'https://www.alphavantage.co/query';
    this.finnhubUrl = 'https://finnhub.io/api/v1';
    this.polygonUrl = 'https://api.polygon.io/v2';
    
    console.log('📊 Stock Market Service initialized');
    console.log('🔑 Alpha Vantage API:', this.alphaVantageKey ? '✅ Configured' : '❌ Missing');
    console.log('🔑 Finnhub API:', this.finnhubKey ? '✅ Configured' : '❌ Missing');
    console.log('🔑 Polygon API:', this.polygonKey ? '✅ Configured' : '❌ Missing');
  }

  // ===================
  // ALPHA VANTAGE API
  // ===================

  // Get real-time stock quote
  async getStockQuote(symbol) {
    try {
      console.log(`📈 Fetching quote for ${symbol} from Alpha Vantage...`);
      
      const response = await axios.get(this.alphaVantageUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: this.alphaVantageKey
        },
        timeout: 10000
      });

      const quote = response.data['Global Quote'];
      
      // Check if we got a valid response
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error('Stock symbol not found or invalid response');
      }

      // Check for API rate limit message
      if (response.data['Note']) {
        throw new Error('API rate limit reached. Please try again later.');
      }

      const result = {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'].replace('%', ''),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        volume: parseInt(quote['06. volume']),
        latestTradingDay: quote['07. latest trading day'],
        source: 'Alpha Vantage'
      };

      console.log(`✅ Quote fetched successfully: ${result.symbol} - $${result.price}`);
      return result;
    } catch (error) {
      console.error('❌ Alpha Vantage API Error:', error.message);
      throw new Error(`Failed to fetch stock quote: ${error.message}`);
    }
  }

  // Get daily time series data
  async getDailyTimeSeries(symbol, outputSize = 'compact') {
    try {
      console.log(`📊 Fetching daily time series for ${symbol}...`);
      
      const response = await axios.get(this.alphaVantageUrl, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          outputsize: outputSize, // compact (100 days) or full (20+ years)
          apikey: this.alphaVantageKey
        },
        timeout: 15000
      });

      const timeSeries = response.data['Time Series (Daily)'];
      
      if (!timeSeries) {
        if (response.data['Note']) {
          throw new Error('API rate limit reached. Please try again later.');
        }
        throw new Error('No time series data found for this symbol');
      }

      // Convert to array format with proper sorting
      const data = Object.entries(timeSeries)
        .map(([date, values]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume'])
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

      console.log(`✅ Time series fetched: ${data.length} data points`);
      return data.slice(0, 100); // Return last 100 days
    } catch (error) {
      console.error('❌ Alpha Vantage Time Series Error:', error.message);
      throw new Error(`Failed to fetch time series: ${error.message}`);
    }
  }

  // Search for stocks
  async searchStocks(keywords) {
    try {
      console.log(`🔍 Searching stocks for: ${keywords}`);
      
      const response = await axios.get(this.alphaVantageUrl, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: keywords,
          apikey: this.alphaVantageKey
        },
        timeout: 10000
      });

      if (response.data['Note']) {
        throw new Error('API rate limit reached. Please try again later.');
      }

      const matches = response.data.bestMatches || [];
      const results = matches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: parseFloat(match['9. matchScore'])
      }));

      console.log(`✅ Search completed: ${results.length} results found`);
      return results;
    } catch (error) {
      console.error('❌ Alpha Vantage Search Error:', error.message);
      throw new Error(`Failed to search stocks: ${error.message}`);
    }
  }

  // ===================
  // FINNHUB API
  // ===================

  // Get real-time price from Finnhub
  async getFinnhubQuote(symbol) {
    try {
      console.log(`📈 Fetching quote for ${symbol} from Finnhub...`);
      
      const response = await axios.get(`${this.finnhubUrl}/quote`, {
        params: {
          symbol: symbol,
          token: this.finnhubKey
        },
        timeout: 10000
      });

      const data = response.data;
      
      // Check if we got valid data
      if (data.c === 0 && data.d === 0 && data.dp === 0) {
        throw new Error('Stock symbol not found or market is closed');
      }

      const result = {
        symbol: symbol,
        currentPrice: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        timestamp: data.t,
        source: 'Finnhub'
      };

      console.log(`✅ Finnhub quote fetched: ${symbol} - $${result.currentPrice}`);
      return result;
    } catch (error) {
      console.error('❌ Finnhub API Error:', error.message);
      throw new Error(`Failed to fetch Finnhub quote: ${error.message}`);
    }
  }

  // Get company profile
  async getCompanyProfile(symbol) {
    try {
      console.log(`🏢 Fetching company profile for ${symbol}...`);
      
      const response = await axios.get(`${this.finnhubUrl}/stock/profile2`, {
        params: {
          symbol: symbol,
          token: this.finnhubKey
        },
        timeout: 10000
      });

      const data = response.data;
      
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Company profile not found');
      }

      console.log(`✅ Company profile fetched for ${data.name || symbol}`);
      return {
        ...data,
        source: 'Finnhub'
      };
    } catch (error) {
      console.error('❌ Finnhub Company Profile Error:', error.message);
      throw new Error(`Failed to fetch company profile: ${error.message}`);
    }
  }

  // Get market news
  async getMarketNews(category = 'general') {
    try {
      console.log(`📰 Fetching market news for category: ${category}`);
      
      const response = await axios.get(`${this.finnhubUrl}/news`, {
        params: {
          category: category,
          token: this.finnhubKey
        },
        timeout: 10000
      });

      const news = response.data || [];
      console.log(`✅ Market news fetched: ${news.length} articles`);
      
      return news.slice(0, 20).map(article => ({
        ...article,
        source: 'Finnhub'
      }));
    } catch (error) {
      console.error('❌ Finnhub News Error:', error.message);
      throw new Error(`Failed to fetch market news: ${error.message}`);
    }
  }

  // Get company news
  async getCompanyNews(symbol, fromDate, toDate) {
    try {
      console.log(`📰 Fetching company news for ${symbol}...`);
      
      // Default to last 7 days if dates not provided
      if (!fromDate) {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        fromDate = date.toISOString().split('T')[0];
      }
      if (!toDate) {
        toDate = new Date().toISOString().split('T')[0];
      }

      const response = await axios.get(`${this.finnhubUrl}/company-news`, {
        params: {
          symbol: symbol,
          from: fromDate,
          to: toDate,
          token: this.finnhubKey
        },
        timeout: 10000
      });

      const news = response.data || [];
      console.log(`✅ Company news fetched: ${news.length} articles`);
      
      return news.slice(0, 15).map(article => ({
        ...article,
        source: 'Finnhub'
      }));
    } catch (error) {
      console.error('❌ Finnhub Company News Error:', error.message);
      throw new Error(`Failed to fetch company news: ${error.message}`);
    }
  }

  // ===================
  // POLYGON API
  // ===================

  // Get stock details from Polygon
  async getPolygonStockDetails(symbol) {
    try {
      console.log(`📊 Fetching stock details for ${symbol} from Polygon...`);
      
      const response = await axios.get(`${this.polygonUrl}/reference/tickers/${symbol}`, {
        params: {
          apikey: this.polygonKey
        },
        timeout: 10000
      });

      const data = response.data.results;
      
      if (!data) {
        throw new Error('Stock details not found');
      }

      console.log(`✅ Polygon stock details fetched for ${data.name || symbol}`);
      return {
        ...data,
        source: 'Polygon'
      };
    } catch (error) {
      console.error('❌ Polygon API Error:', error.message);
      throw new Error(`Failed to fetch stock details: ${error.message}`);
    }
  }

  // Get aggregated bars (OHLC data)
  async getPolygonAggregates(symbol, timespan = 'day', from, to) {
    try {
      console.log(`📊 Fetching aggregates for ${symbol} from Polygon...`);
      
      // Default to last 30 days if dates not provided
      if (!from) {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        from = date.toISOString().split('T')[0];
      }
      if (!to) {
        to = new Date().toISOString().split('T')[0];
      }

      const response = await axios.get(`${this.polygonUrl}/aggs/ticker/${symbol}/range/1/${timespan}/${from}/${to}`, {
        params: {
          adjusted: true,
          sort: 'desc',
          limit: 5000,
          apikey: this.polygonKey
        },
        timeout: 15000
      });

      const results = response.data.results || [];
      console.log(`✅ Polygon aggregates fetched: ${results.length} data points`);
      
      return results.map(bar => ({
        timestamp: bar.t,
        date: new Date(bar.t).toISOString().split('T')[0],
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
        volumeWeighted: bar.vw,
        source: 'Polygon'
      }));
    } catch (error) {
      console.error('❌ Polygon Aggregates Error:', error.message);
      throw new Error(`Failed to fetch aggregates: ${error.message}`);
    }
  }

  // ===================
  // COMBINED METHODS
  // ===================

  // Get comprehensive stock data using multiple APIs
  async getComprehensiveStockData(symbol) {
    try {
      console.log(`📊 Fetching comprehensive data for ${symbol} from multiple sources...`);
      
      const results = await Promise.allSettled([
        this.getStockQuote(symbol),
        this.getFinnhubQuote(symbol),
        this.getCompanyProfile(symbol),
        this.getPolygonStockDetails(symbol)
      ]);

      const alphaQuote = results[0].status === 'fulfilled' ? results[0].value : null;
      const finnhubQuote = results[1].status === 'fulfilled' ? results[1].value : null;
      const companyProfile = results[2].status === 'fulfilled' ? results[2].value : null;
      const polygonDetails = results[3].status === 'fulfilled' ? results[3].value : null;

      // Count successful API calls
      const successfulCalls = results.filter(result => result.status === 'fulfilled').length;
      console.log(`✅ Comprehensive data fetched: ${successfulCalls}/4 APIs successful`);

      return {
        symbol: symbol,
        alphaVantageQuote: alphaQuote,
        finnhubQuote: finnhubQuote,
        companyProfile: companyProfile,
        polygonDetails: polygonDetails,
        dataSource: 'multiple_apis',
        successfulAPIs: successfulCalls,
        timestamp: new Date().toISOString(),
        errors: results
          .filter(result => result.status === 'rejected')
          .map(result => result.reason.message)
      };
    } catch (error) {
      console.error('❌ Comprehensive Stock Data Error:', error.message);
      throw new Error(`Failed to fetch comprehensive data: ${error.message}`);
    }
  }

  // Get market overview with major indices
  async getMarketOverview() {
    try {
      console.log('🌍 Fetching market overview...');
      
      const [news, spyQuote, qqqQuote, diaQuote] = await Promise.allSettled([
        this.getMarketNews(),
        this.getStockQuote('SPY'),   // S&P 500 ETF
        this.getStockQuote('QQQ'),   // NASDAQ ETF
        this.getStockQuote('DIA')    // Dow Jones ETF
      ]);

      const successfulCalls = [news, spyQuote, qqqQuote, diaQuote]
        .filter(result => result.status === 'fulfilled').length;

      console.log(`✅ Market overview fetched: ${successfulCalls}/4 data sources successful`);

      return {
        marketNews: news.status === 'fulfilled' ? news.value : [],
        majorIndices: {
          spy: spyQuote.status === 'fulfilled' ? spyQuote.value : null,
          qqq: qqqQuote.status === 'fulfilled' ? qqqQuote.value : null,
          dia: diaQuote.status === 'fulfilled' ? diaQuote.value : null
        },
        successfulCalls: successfulCalls,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Market Overview Error:', error.message);
      throw new Error(`Failed to fetch market overview: ${error.message}`);
    }
  }

  // Test all API connections
  async testAllAPIs() {
    try {
      console.log('🧪 Testing all Stock Market APIs...\n');
      
      const testResults = {
        alphaVantage: { status: 'pending', message: '', data: null },
        finnhub: { status: 'pending', message: '', data: null },
        polygon: { status: 'pending', message: '', data: null }
      };

      // Test Alpha Vantage
      try {
        const alphaTest = await this.getStockQuote('AAPL');
        testResults.alphaVantage = {
          status: 'success',
          message: 'API working correctly',
          data: alphaTest
        };
      } catch (error) {
        testResults.alphaVantage = {
          status: 'error',
          message: error.message,
          data: null
        };
      }

      // Test Finnhub
      try {
        const finnhubTest = await this.getFinnhubQuote('AAPL');
        testResults.finnhub = {
          status: 'success',
          message: 'API working correctly',
          data: finnhubTest
        };
      } catch (error) {
        testResults.finnhub = {
          status: 'error',
          message: error.message,
          data: null
        };
      }

      // Test Polygon
      try {
        const polygonTest = await this.getPolygonStockDetails('AAPL');
        testResults.polygon = {
          status: 'success',
          message: 'API working correctly',
          data: polygonTest
        };
      } catch (error) {
        testResults.polygon = {
          status: 'error',
          message: error.message,
          data: null
        };
      }

      console.log('🧪 API Test Results:');
      console.log('Alpha Vantage:', testResults.alphaVantage.status === 'success' ? '✅' : '❌', testResults.alphaVantage.message);
      console.log('Finnhub:', testResults.finnhub.status === 'success' ? '✅' : '❌', testResults.finnhub.message);
      console.log('Polygon:', testResults.polygon.status === 'success' ? '✅' : '❌', testResults.polygon.message);

      return testResults;
    } catch (error) {
      console.error('❌ API Test Error:', error.message);
      throw new Error(`Failed to test APIs: ${error.message}`);
    }
  }
}

module.exports = new StockMarketService();