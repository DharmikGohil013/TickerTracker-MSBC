const axios = require('axios');

class AlphaVantageService {
  constructor() {
    this.baseURL = 'https://www.alphavantage.co/query';
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  }

  // Get real-time stock quote
  async getQuote(symbol) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: this.apiKey
        }
      });

      const quote = response.data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error('No data found for symbol');
      }

      return {
        symbol: quote['01. symbol'],
        currentPrice: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'].replace('%', ''),
        previousClose: parseFloat(quote['08. previous close']),
        open: parseFloat(quote['02. open']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        volume: parseInt(quote['06. volume']),
        latestTradingDay: quote['07. latest trading day']
      };
    } catch (error) {
      console.error('Alpha Vantage Quote Error:', error.message);
      throw new Error('Failed to fetch stock quote');
    }
  }

  // Get daily historical data
  async getDailyHistory(symbol, outputsize = 'compact') {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          outputsize: outputsize, // compact = last 100 days, full = 20+ years
          apikey: this.apiKey
        }
      });

      const timeSeries = response.data['Time Series (Daily)'];
      if (!timeSeries) {
        throw new Error('No historical data found for symbol');
      }

      const history = Object.entries(timeSeries).map(([date, data]) => ({
        date: date,
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'])
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      return history;
    } catch (error) {
      console.error('Alpha Vantage History Error:', error.message);
      throw new Error('Failed to fetch historical data');
    }
  }

  // Get intraday data (for real-time charts)
  async getIntradayData(symbol, interval = '5min') {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol: symbol,
          interval: interval, // 1min, 5min, 15min, 30min, 60min
          apikey: this.apiKey
        }
      });

      const timeSeries = response.data[`Time Series (${interval})`];
      if (!timeSeries) {
        throw new Error('No intraday data found for symbol');
      }

      const data = Object.entries(timeSeries).map(([datetime, data]) => ({
        datetime: datetime,
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'])
      })).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

      return data;
    } catch (error) {
      console.error('Alpha Vantage Intraday Error:', error.message);
      throw new Error('Failed to fetch intraday data');
    }
  }

  // Get cryptocurrency data
  async getCryptoQuote(symbol, market = 'USD') {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: symbol,
          to_currency: market,
          apikey: this.apiKey
        }
      });

      const exchangeRate = response.data['Realtime Currency Exchange Rate'];
      if (!exchangeRate) {
        throw new Error('No cryptocurrency data found');
      }

      return {
        symbol: exchangeRate['1. From_Currency Code'],
        name: exchangeRate['2. From_Currency Name'],
        currentPrice: parseFloat(exchangeRate['5. Exchange Rate']),
        lastRefreshed: exchangeRate['6. Last Refreshed'],
        market: exchangeRate['4. To_Currency Name']
      };
    } catch (error) {
      console.error('Alpha Vantage Crypto Error:', error.message);
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }

  // Get daily crypto history
  async getCryptoDailyHistory(symbol, market = 'USD') {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'DIGITAL_CURRENCY_DAILY',
          symbol: symbol,
          market: market,
          apikey: this.apiKey
        }
      });

      const timeSeries = response.data['Time Series (Digital Currency Daily)'];
      if (!timeSeries) {
        throw new Error('No crypto historical data found');
      }

      const history = Object.entries(timeSeries).map(([date, data]) => ({
        date: date,
        open: parseFloat(data[`1a. open (${market})`]),
        high: parseFloat(data[`2a. high (${market})`]),
        low: parseFloat(data[`3a. low (${market})`]),
        close: parseFloat(data[`4a. close (${market})`]),
        volume: parseFloat(data['5. volume'])
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      return history;
    } catch (error) {
      console.error('Alpha Vantage Crypto History Error:', error.message);
      throw new Error('Failed to fetch crypto historical data');
    }
  }

  // Search for symbols
  async searchSymbols(keywords) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: keywords,
          apikey: this.apiKey
        }
      });

      const matches = response.data['bestMatches'];
      if (!matches || matches.length === 0) {
        return [];
      }

      return matches.map(match => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency']
      }));
    } catch (error) {
      console.error('Alpha Vantage Search Error:', error.message);
      throw new Error('Failed to search symbols');
    }
  }
}

module.exports = AlphaVantageService;