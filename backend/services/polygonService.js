const axios = require('axios');

class PolygonService {
  constructor() {
    this.baseURL = 'https://api.polygon.io';
    this.apiKey = process.env.POLYGON_API_KEY;
  }

  // Get real-time stock quote
  async getQuote(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/v2/last/trade/${symbol}`, {
        params: {
          apikey: this.apiKey
        }
      });

      const result = response.data.results;
      return {
        symbol: symbol,
        currentPrice: result.p,
        size: result.s,
        timestamp: new Date(result.t),
        exchange: result.x
      };
    } catch (error) {
      console.error('Polygon Quote Error:', error.message);
      throw new Error('Failed to fetch stock quote');
    }
  }

  // Get aggregated bars (OHLCV)
  async getAggregates(symbol, multiplier = 1, timespan = 'day', from = null, to = null) {
    try {
      const toDate = to || new Date().toISOString().split('T')[0];
      const fromDate = from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await axios.get(`${this.baseURL}/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${fromDate}/${toDate}`, {
        params: {
          adjusted: true,
          sort: 'asc',
          limit: 50000,
          apikey: this.apiKey
        }
      });

      if (!response.data.results) {
        throw new Error('No aggregate data found');
      }

      return response.data.results.map(bar => ({
        date: new Date(bar.t),
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
        volumeWeightedPrice: bar.vw,
        numberOfTransactions: bar.n
      }));
    } catch (error) {
      console.error('Polygon Aggregates Error:', error.message);
      throw new Error('Failed to fetch aggregate data');
    }
  }

  // Get previous day's OHLCV
  async getPreviousClose(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/v2/aggs/ticker/${symbol}/prev`, {
        params: {
          adjusted: true,
          apikey: this.apiKey
        }
      });

      const result = response.data.results[0];
      return {
        symbol: symbol,
        date: new Date(result.t),
        open: result.o,
        high: result.h,
        low: result.l,
        close: result.c,
        volume: result.v,
        volumeWeightedPrice: result.vw
      };
    } catch (error) {
      console.error('Polygon Previous Close Error:', error.message);
      throw new Error('Failed to fetch previous close data');
    }
  }

  // Get market status
  async getMarketStatus() {
    try {
      const response = await axios.get(`${this.baseURL}/v1/marketstatus/now`, {
        params: {
          apikey: this.apiKey
        }
      });

      return {
        market: response.data.market,
        serverTime: response.data.serverTime,
        exchanges: response.data.exchanges,
        currencies: response.data.currencies
      };
    } catch (error) {
      console.error('Polygon Market Status Error:', error.message);
      throw new Error('Failed to fetch market status');
    }
  }

  // Get ticker details
  async getTickerDetails(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/v3/reference/tickers/${symbol}`, {
        params: {
          apikey: this.apiKey
        }
      });

      const result = response.data.results;
      return {
        ticker: result.ticker,
        name: result.name,
        market: result.market,
        locale: result.locale,
        primaryExchange: result.primary_exchange,
        type: result.type,
        active: result.active,
        currencyName: result.currency_name,
        cik: result.cik,
        compositeFigi: result.composite_figi,
        shareClassFigi: result.share_class_figi,
        marketCap: result.market_cap,
        phoneNumber: result.phone_number,
        address: result.address,
        description: result.description,
        sic_description: result.sic_description,
        homepage_url: result.homepage_url,
        totalEmployees: result.total_employees,
        listDate: result.list_date,
        branding: result.branding
      };
    } catch (error) {
      console.error('Polygon Ticker Details Error:', error.message);
      throw new Error('Failed to fetch ticker details');
    }
  }

  // Get ticker news
  async getTickerNews(symbol, limit = 10) {
    try {
      const response = await axios.get(`${this.baseURL}/v2/reference/news`, {
        params: {
          ticker: symbol,
          limit: limit,
          sort: 'published_utc',
          order: 'desc',
          apikey: this.apiKey
        }
      });

      return response.data.results.map(article => ({
        id: article.id,
        title: article.title,
        author: article.author,
        publishedAt: new Date(article.published_utc),
        articleUrl: article.article_url,
        imageUrl: article.image_url,
        description: article.description,
        keywords: article.keywords,
        insights: article.insights,
        publisher: article.publisher
      }));
    } catch (error) {
      console.error('Polygon Ticker News Error:', error.message);
      throw new Error('Failed to fetch ticker news');
    }
  }

  // Get crypto data
  async getCryptoAggregates(from, to, symbol = 'X:BTCUSD', multiplier = 1, timespan = 'day') {
    try {
      const response = await axios.get(`${this.baseURL}/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}`, {
        params: {
          adjusted: true,
          sort: 'asc',
          limit: 50000,
          apikey: this.apiKey
        }
      });

      if (!response.data.results) {
        throw new Error('No crypto aggregate data found');
      }

      return response.data.results.map(bar => ({
        date: new Date(bar.t),
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
        volumeWeightedPrice: bar.vw,
        numberOfTransactions: bar.n
      }));
    } catch (error) {
      console.error('Polygon Crypto Aggregates Error:', error.message);
      throw new Error('Failed to fetch crypto aggregate data');
    }
  }

  // Get real-time crypto quote
  async getCryptoQuote(from = 'BTC', to = 'USD') {
    try {
      const response = await axios.get(`${this.baseURL}/v1/last_quote/currencies/${from}/${to}`, {
        params: {
          apikey: this.apiKey
        }
      });

      const result = response.data.last_quote;
      return {
        symbol: `${from}/${to}`,
        bid: result.bid,
        ask: result.ask,
        exchange: result.exchange,
        timestamp: new Date(result.timestamp)
      };
    } catch (error) {
      console.error('Polygon Crypto Quote Error:', error.message);
      throw new Error('Failed to fetch crypto quote');
    }
  }

  // Search for tickers
  async searchTickers(search, type = null, market = null, active = true) {
    try {
      const params = {
        search: search,
        active: active,
        limit: 100,
        apikey: this.apiKey
      };

      if (type) params.type = type;
      if (market) params.market = market;

      const response = await axios.get(`${this.baseURL}/v3/reference/tickers`, {
        params: params
      });

      return response.data.results.map(ticker => ({
        ticker: ticker.ticker,
        name: ticker.name,
        market: ticker.market,
        locale: ticker.locale,
        primaryExchange: ticker.primary_exchange,
        type: ticker.type,
        active: ticker.active,
        currencyName: ticker.currency_name,
        cik: ticker.cik,
        compositeFigi: ticker.composite_figi,
        shareClassFigi: ticker.share_class_figi
      }));
    } catch (error) {
      console.error('Polygon Search Error:', error.message);
      throw new Error('Failed to search tickers');
    }
  }
}

module.exports = PolygonService;