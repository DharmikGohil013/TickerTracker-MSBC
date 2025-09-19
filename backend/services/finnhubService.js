const axios = require('axios');

class FinnhubService {
  constructor() {
    this.baseURL = 'https://finnhub.io/api/v1';
    this.apiKey = process.env.FINNHUB_API_KEY;
  }

  // Get company news
  async getCompanyNews(symbol, fromDate = null, toDate = null) {
    try {
      const to = toDate || new Date().toISOString().split('T')[0];
      const from = fromDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await axios.get(`${this.baseURL}/company-news`, {
        params: {
          symbol: symbol,
          from: from,
          to: to,
          token: this.apiKey
        }
      });

      return response.data.map(article => ({
        id: article.id,
        title: article.headline,
        summary: article.summary || article.headline,
        content: article.summary,
        source: article.source,
        sourceUrl: article.url,
        publishedAt: new Date(article.datetime * 1000),
        imageUrl: article.image,
        category: article.category,
        relatedStocks: [{ symbol: symbol.toUpperCase(), market: 'US' }]
      }));
    } catch (error) {
      console.error('Finnhub Company News Error:', error.message);
      throw new Error('Failed to fetch company news');
    }
  }

  // Get general market news
  async getMarketNews(category = 'general') {
    try {
      const response = await axios.get(`${this.baseURL}/news`, {
        params: {
          category: category, // general, forex, crypto, merger
          token: this.apiKey
        }
      });

      return response.data.map(article => ({
        id: article.id,
        title: article.headline,
        summary: article.summary || article.headline,
        content: article.summary,
        source: article.source,
        sourceUrl: article.url,
        publishedAt: new Date(article.datetime * 1000),
        imageUrl: article.image,
        category: category,
        relatedStocks: []
      }));
    } catch (error) {
      console.error('Finnhub Market News Error:', error.message);
      throw new Error('Failed to fetch market news');
    }
  }

  // Get company basic information
  async getCompanyProfile(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/profile2`, {
        params: {
          symbol: symbol,
          token: this.apiKey
        }
      });

      return {
        symbol: symbol,
        name: response.data.name,
        country: response.data.country,
        currency: response.data.currency,
        exchange: response.data.exchange,
        industry: response.data.finnhubIndustry,
        marketCap: response.data.marketCapitalization,
        shareOutstanding: response.data.shareOutstanding,
        logo: response.data.logo,
        weburl: response.data.weburl
      };
    } catch (error) {
      console.error('Finnhub Company Profile Error:', error.message);
      throw new Error('Failed to fetch company profile');
    }
  }

  // Get real-time quote
  async getQuote(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/quote`, {
        params: {
          symbol: symbol,
          token: this.apiKey
        }
      });

      const data = response.data;
      return {
        symbol: symbol,
        currentPrice: data.c, // Current price
        change: data.d, // Change
        changePercent: data.dp, // Percent change
        high: data.h, // High price of the day
        low: data.l, // Low price of the day
        open: data.o, // Open price of the day
        previousClose: data.pc, // Previous close price
        timestamp: data.t // Timestamp
      };
    } catch (error) {
      console.error('Finnhub Quote Error:', error.message);
      throw new Error('Failed to fetch stock quote');
    }
  }

  // Get stock candles (OHLCV data)
  async getCandles(symbol, resolution = 'D', from = null, to = null) {
    try {
      const toDate = to || Math.floor(Date.now() / 1000);
      const fromDate = from || Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);

      const response = await axios.get(`${this.baseURL}/stock/candle`, {
        params: {
          symbol: symbol,
          resolution: resolution, // 1, 5, 15, 30, 60, D, W, M
          from: fromDate,
          to: toDate,
          token: this.apiKey
        }
      });

      const data = response.data;
      if (data.s !== 'ok') {
        throw new Error('No candle data available');
      }

      return data.t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000),
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index]
      }));
    } catch (error) {
      console.error('Finnhub Candles Error:', error.message);
      throw new Error('Failed to fetch candle data');
    }
  }

  // Get recommendation trends
  async getRecommendationTrends(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/recommendation`, {
        params: {
          symbol: symbol,
          token: this.apiKey
        }
      });

      return response.data.map(rec => ({
        period: rec.period,
        strongBuy: rec.strongBuy,
        buy: rec.buy,
        hold: rec.hold,
        sell: rec.sell,
        strongSell: rec.strongSell
      }));
    } catch (error) {
      console.error('Finnhub Recommendation Error:', error.message);
      throw new Error('Failed to fetch recommendations');
    }
  }

  // Get social sentiment
  async getSocialSentiment(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/social-sentiment`, {
        params: {
          symbol: symbol,
          token: this.apiKey
        }
      });

      return {
        reddit: response.data.reddit,
        twitter: response.data.twitter,
        symbol: symbol
      };
    } catch (error) {
      console.error('Finnhub Social Sentiment Error:', error.message);
      throw new Error('Failed to fetch social sentiment');
    }
  }

  // Get crypto exchanges
  async getCryptoExchanges() {
    try {
      const response = await axios.get(`${this.baseURL}/crypto/exchange`, {
        params: {
          token: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Finnhub Crypto Exchanges Error:', error.message);
      throw new Error('Failed to fetch crypto exchanges');
    }
  }

  // Get crypto symbols
  async getCryptoSymbols(exchange) {
    try {
      const response = await axios.get(`${this.baseURL}/crypto/symbol`, {
        params: {
          exchange: exchange,
          token: this.apiKey
        }
      });

      return response.data.map(symbol => ({
        description: symbol.description,
        displaySymbol: symbol.displaySymbol,
        symbol: symbol.symbol
      }));
    } catch (error) {
      console.error('Finnhub Crypto Symbols Error:', error.message);
      throw new Error('Failed to fetch crypto symbols');
    }
  }

  // Get crypto candles
  async getCryptoCandles(symbol, resolution = 'D', from = null, to = null) {
    try {
      const toDate = to || Math.floor(Date.now() / 1000);
      const fromDate = from || Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);

      const response = await axios.get(`${this.baseURL}/crypto/candle`, {
        params: {
          symbol: symbol,
          resolution: resolution,
          from: fromDate,
          to: toDate,
          token: this.apiKey
        }
      });

      const data = response.data;
      if (data.s !== 'ok') {
        throw new Error('No crypto candle data available');
      }

      return data.t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000),
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index]
      }));
    } catch (error) {
      console.error('Finnhub Crypto Candles Error:', error.message);
      throw new Error('Failed to fetch crypto candle data');
    }
  }
}

module.exports = FinnhubService;