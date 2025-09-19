const AlphaVantageService = require('../services/alphaVantageService');
const FinnhubService = require('../services/finnhubService');
const PolygonService = require('../services/polygonService');

const alphaVantage = new AlphaVantageService();
const finnhub = new FinnhubService();
const polygon = new PolygonService();

// @desc    Get price movement alerts for a symbol
// @route   GET /api/alerts/:symbol
// @access  Public
const getSymbolAlerts = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { market = 'US' } = req.query;

    console.log(`Generating alerts for ${symbol} in ${market} market`);

    let alerts = [];
    let stockData = null;

    try {
      // Get current stock data first
      if (market.toLowerCase() === 'crypto') {
        stockData = await alphaVantage.getCryptoQuote(symbol, 'USD');
      } else {
        try {
          stockData = await alphaVantage.getQuote(symbol);
        } catch (error) {
          stockData = await finnhub.getQuote(symbol);
        }
      }

      if (stockData) {
        // Generate price alerts based on current data
        const priceChange = stockData.change || (stockData.currentPrice - stockData.previousClose);
        const percentChange = Math.abs((priceChange / (stockData.previousClose || stockData.currentPrice)) * 100);

        // Price movement alerts
        if (percentChange >= 5) {
          alerts.push({
            id: `price_${symbol}_${Date.now()}`,
            type: priceChange > 0 ? 'price_up' : 'price_down',
            color: priceChange > 0 ? 'green' : 'red',
            icon: priceChange > 0 ? '🟢' : '🔴',
            title: 'Price Alert',
            message: `${symbol} price ${priceChange > 0 ? 'up' : 'down'} ${percentChange.toFixed(2)}% today`,
            time: 'Just now',
            priority: percentChange >= 10 ? 'high' : 'medium',
            metadata: {
              currentPrice: stockData.currentPrice,
              priceChange: priceChange,
              percentChange: percentChange
            }
          });
        }

        // Volume alerts (mock for now - would need historical volume data)
        if (stockData.volume && stockData.volume > 5000000) {
          alerts.push({
            id: `volume_${symbol}_${Date.now()}`,
            type: 'volume_spike',
            color: 'orange',
            icon: '🟡',
            title: 'Volume Alert',
            message: `${symbol} trading volume ${(stockData.volume / 1000000).toFixed(1)}M above average`,
            time: '15 min ago',
            priority: 'medium',
            metadata: {
              volume: stockData.volume
            }
          });
        }

        // Technical analysis alerts (mock)
        const rsiMock = Math.floor(Math.random() * 100);
        if (rsiMock > 70) {
          alerts.push({
            id: `technical_${symbol}_${Date.now()}`,
            type: 'technical_signal',
            color: 'blue',
            icon: '🔵',
            title: 'Technical Signal',
            message: `${symbol} RSI indicates overbought condition (${rsiMock})`,
            time: '30 min ago',
            priority: 'low',
            metadata: {
              indicator: 'RSI',
              value: rsiMock
            }
          });
        } else if (rsiMock < 30) {
          alerts.push({
            id: `technical_${symbol}_${Date.now()}`,
            type: 'technical_signal',
            color: 'blue',
            icon: '🔵',
            title: 'Technical Signal',
            message: `${symbol} RSI indicates oversold condition (${rsiMock})`,
            time: '30 min ago',
            priority: 'medium',
            metadata: {
              indicator: 'RSI',
              value: rsiMock
            }
          });
        }
      }

      // Add news-based alerts
      try {
        const recentNews = await finnhub.getCompanyNews(symbol);
        if (recentNews && recentNews.length > 0) {
          // Check for recent breaking news
          const latestNews = recentNews[0];
          const newsAge = Date.now() - new Date(latestNews.publishedAt).getTime();
          
          if (newsAge < 60 * 60 * 1000) { // News within last hour
            alerts.push({
              id: `news_${symbol}_${Date.now()}`,
              type: 'breaking_news',
              color: 'blue',
              icon: '🔵',
              title: 'Breaking News',
              message: `Breaking: ${latestNews.title.slice(0, 60)}...`,
              time: 'Just now',
              priority: 'high',
              metadata: {
                newsId: latestNews.id,
                newsTitle: latestNews.title,
                source: latestNews.source
              }
            });
          }
        }
      } catch (newsError) {
        console.log('Failed to fetch news for alerts');
      }

      // Add sentiment alerts (mock for now)
      const sentimentMock = Math.random();
      if (sentimentMock > 0.8) {
        alerts.push({
          id: `sentiment_${symbol}_${Date.now()}`,
          type: 'sentiment_positive',
          color: 'green',
          icon: '🟢',
          title: 'Sentiment Alert',
          message: `${symbol} positive sentiment trending on social media`,
          time: '5 min ago',
          priority: 'medium',
          metadata: {
            sentimentScore: sentimentMock,
            platform: 'Twitter'
          }
        });
      } else if (sentimentMock < 0.2) {
        alerts.push({
          id: `sentiment_${symbol}_${Date.now()}`,
          type: 'sentiment_negative',
          color: 'red',
          icon: '🔴',
          title: 'Sentiment Alert',
          message: `${symbol} negative sentiment detected across platforms`,
          time: '10 min ago',
          priority: 'medium',
          metadata: {
            sentimentScore: sentimentMock,
            platform: 'Reddit'
          }
        });
      }

    } catch (stockError) {
      console.error('Failed to fetch stock data for alerts:', stockError);
      
      // Return mock alerts if stock data fetch fails
      alerts = [
        {
          id: `mock_${symbol}_${Date.now()}`,
          type: 'breaking_news',
          color: 'blue',
          icon: '🔵',
          title: 'Market Alert',
          message: `${symbol} is currently being monitored for price movements`,
          time: 'Just now',
          priority: 'low',
          metadata: {}
        }
      ];
    }

    // Sort alerts by priority and time
    const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    alerts.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.time) - new Date(a.time);
    });

    res.json({
      success: true,
      data: alerts,
      meta: {
        symbol: symbol,
        market: market,
        count: alerts.length,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Alerts Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating alerts'
    });
  }
};

// @desc    Get general market alerts
// @route   GET /api/alerts
// @access  Public
const getMarketAlerts = async (req, res) => {
  try {
    const { limit = 20, priority = 'all' } = req.query;

    console.log('Generating general market alerts');

    let alerts = [];

    // General market alerts (mock data for demonstration)
    const marketAlerts = [
      {
        id: `market_${Date.now()}_1`,
        type: 'breaking_news',
        color: 'blue',
        icon: '🔵',
        title: 'Market News',
        message: 'Fed announces emergency meeting regarding interest rates',
        time: '30 min ago',
        priority: 'critical',
        metadata: {
          category: 'monetary_policy'
        }
      },
      {
        id: `market_${Date.now()}_2`,
        type: 'volume_spike',
        color: 'orange',
        icon: '🟡',
        title: 'Market Activity',
        message: 'Unusual trading volume detected in tech sector',
        time: '1 hour ago',
        priority: 'high',
        metadata: {
          sector: 'technology'
        }
      },
      {
        id: `market_${Date.now()}_3`,
        type: 'price_up',
        color: 'green',
        icon: '🟢',
        title: 'Index Movement',
        message: 'S&P 500 up 1.5% in early trading',
        time: '2 hours ago',
        priority: 'medium',
        metadata: {
          index: 'SPX',
          change: '+1.5%'
        }
      },
      {
        id: `market_${Date.now()}_4`,
        type: 'sentiment_positive',
        color: 'green',
        icon: '🟢',
        title: 'Market Sentiment',
        message: 'Overall market sentiment remains bullish',
        time: '3 hours ago',
        priority: 'low',
        metadata: {
          sentimentScore: 0.7
        }
      }
    ];

    alerts = marketAlerts;

    // Filter by priority if specified
    if (priority !== 'all') {
      alerts = alerts.filter(alert => alert.priority === priority);
    }

    // Limit results
    alerts = alerts.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: alerts,
      meta: {
        count: alerts.length,
        limit: parseInt(limit),
        priority: priority,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Market Alerts Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching market alerts'
    });
  }
};

// @desc    Create a price alert for a user
// @route   POST /api/alerts/:symbol
// @access  Private (would need authentication)
const createPriceAlert = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { 
      alertType = 'price_change',
      threshold = 5,
      condition = 'above',
      targetPrice = null
    } = req.body;

    console.log(`Creating price alert for ${symbol}`);

    // In a real app, you would save this to the database
    // For now, we'll just return a success response
    const alertData = {
      id: `user_alert_${symbol}_${Date.now()}`,
      symbol: symbol,
      alertType: alertType,
      threshold: threshold,
      condition: condition,
      targetPrice: targetPrice,
      isActive: true,
      createdAt: new Date().toISOString(),
      triggeredAt: null
    };

    res.status(201).json({
      success: true,
      message: 'Price alert created successfully',
      data: alertData
    });

  } catch (error) {
    console.error('Create Alert Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating alert'
    });
  }
};

// @desc    Get watchlist alerts
// @route   GET /api/alerts/watchlist
// @access  Private (would need authentication)
const getWatchlistAlerts = async (req, res) => {
  try {
    console.log('Fetching watchlist alerts');

    // Mock watchlist alerts
    const watchlistAlerts = [
      {
        id: 'watchlist_1',
        symbol: 'AAPL',
        type: 'price_target',
        message: 'AAPL reached your target price of $175',
        triggered: true,
        time: '10 min ago'
      },
      {
        id: 'watchlist_2',
        symbol: 'TSLA',
        type: 'volume_alert',
        message: 'TSLA volume 300% above average',
        triggered: true,
        time: '25 min ago'
      }
    ];

    res.json({
      success: true,
      data: watchlistAlerts,
      meta: {
        count: watchlistAlerts.length
      }
    });

  } catch (error) {
    console.error('Watchlist Alerts Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching watchlist alerts'
    });
  }
};

module.exports = {
  getSymbolAlerts,
  getMarketAlerts,
  createPriceAlert,
  getWatchlistAlerts
};