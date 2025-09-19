const FinnhubService = require('../services/finnhubService');
const PolygonService = require('../services/polygonService');

const finnhub = new FinnhubService();
const polygon = new PolygonService();

// Simple sentiment analysis function
const analyzeSentiment = (text) => {
  const positiveWords = ['bullish', 'positive', 'gain', 'up', 'rise', 'growth', 'profit', 'strong', 'buy', 'upgrade', 'beat', 'exceed', 'good', 'excellent', 'successful'];
  const negativeWords = ['bearish', 'negative', 'loss', 'down', 'fall', 'decline', 'weak', 'sell', 'downgrade', 'miss', 'poor', 'bad', 'failure', 'concern', 'risk'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return { sentiment: 'positive', score: 0.7, icon: '😃' };
  if (negativeCount > positiveCount) return { sentiment: 'negative', score: -0.7, icon: '😡' };
  return { sentiment: 'neutral', score: 0, icon: '😐' };
};

// @desc    Get news for a specific symbol
// @route   GET /api/news/:symbol
// @access  Public
const getSymbolNews = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { limit = 10, market = 'US' } = req.query;

    console.log(`Fetching news for ${symbol} in ${market} market`);

    let newsData = [];
    let error = null;

    try {
      // Try Finnhub first for company news
      const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const toDate = new Date().toISOString().split('T')[0];
      
      newsData = await finnhub.getCompanyNews(symbol, fromDate, toDate);
      
      // Add sentiment analysis to each article
      newsData = newsData.map(article => {
        const sentimentAnalysis = analyzeSentiment(article.title + ' ' + (article.summary || ''));
        return {
          ...article,
          sentiment: sentimentAnalysis.sentiment,
          sentimentScore: sentimentAnalysis.score,
          sentimentIcon: sentimentAnalysis.icon
        };
      });
      
    } catch (finnhubError) {
      console.log('Finnhub news failed, trying Polygon...');
      try {
        const polygonNews = await polygon.getTickerNews(symbol, parseInt(limit));
        newsData = polygonNews.map(article => {
          const sentimentAnalysis = analyzeSentiment(article.title + ' ' + (article.description || ''));
          return {
            id: article.id,
            title: article.title,
            summary: article.description || article.title,
            content: article.description,
            source: article.publisher?.name || 'Unknown',
            sourceUrl: article.article_url,
            publishedAt: article.publishedAt,
            imageUrl: article.image_url,
            category: 'company',
            relatedStocks: [{ symbol: symbol.toUpperCase(), market }],
            sentiment: sentimentAnalysis.sentiment,
            sentimentScore: sentimentAnalysis.score,
            sentimentIcon: sentimentAnalysis.icon
          };
        });
      } catch (polygonError) {
        error = 'Failed to fetch news from all sources';
      }
    }

    if (error) {
      return res.status(404).json({
        success: false,
        message: error
      });
    }

    // Sort by publish date and limit results
    newsData = newsData
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: newsData,
      meta: {
        symbol: symbol,
        market: market,
        count: newsData.length,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('News Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching news'
    });
  }
};

// @desc    Get general market news
// @route   GET /api/news
// @access  Public
const getMarketNews = async (req, res) => {
  try {
    const { category = 'general', limit = 20 } = req.query;

    console.log(`Fetching ${category} market news`);

    let newsData = [];

    try {
      newsData = await finnhub.getMarketNews(category);
      
      // Add sentiment analysis
      newsData = newsData.map(article => {
        const sentimentAnalysis = analyzeSentiment(article.title + ' ' + (article.summary || ''));
        return {
          ...article,
          sentiment: sentimentAnalysis.sentiment,
          sentimentScore: sentimentAnalysis.score,
          sentimentIcon: sentimentAnalysis.icon
        };
      });
      
    } catch (error) {
      console.error('Failed to fetch market news:', error);
      // Return mock data if API fails
      newsData = [
        {
          id: 'mock-1',
          title: 'Markets Show Mixed Signals Amid Economic Uncertainty',
          summary: 'Stock markets displayed varied performance as investors weigh economic indicators and policy decisions.',
          source: 'Market News',
          publishedAt: new Date(),
          sentiment: 'neutral',
          sentimentScore: 0,
          sentimentIcon: '😐'
        }
      ];
    }

    // Sort and limit
    newsData = newsData
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: newsData,
      meta: {
        category: category,
        count: newsData.length,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Market News Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching market news'
    });
  }
};

// @desc    Get social sentiment for a symbol
// @route   GET /api/news/:symbol/sentiment
// @access  Public
const getSocialSentiment = async (req, res) => {
  try {
    const { symbol } = req.params;

    console.log(`Fetching social sentiment for ${symbol}`);

    let sentimentData = {};

    try {
      sentimentData = await finnhub.getSocialSentiment(symbol);
      
      // Calculate overall sentiment score
      let overallScore = 0;
      let overallSentiment = 'neutral';
      
      if (sentimentData.reddit && sentimentData.twitter) {
        const redditScore = sentimentData.reddit.length > 0 ? 
          sentimentData.reddit.reduce((acc, item) => acc + item.score, 0) / sentimentData.reddit.length : 0;
        const twitterScore = sentimentData.twitter.length > 0 ? 
          sentimentData.twitter.reduce((acc, item) => acc + item.score, 0) / sentimentData.twitter.length : 0;
        
        overallScore = (redditScore + twitterScore) / 2;
        
        if (overallScore > 0.1) overallSentiment = 'positive';
        else if (overallScore < -0.1) overallSentiment = 'negative';
      }
      
      sentimentData.overall = {
        sentiment: overallSentiment,
        score: overallScore,
        icon: overallScore > 0.1 ? '😃' : overallScore < -0.1 ? '😡' : '😐'
      };
      
    } catch (error) {
      console.log('Finnhub sentiment failed, using mock data');
      // Mock sentiment data
      const mockScore = (Math.random() - 0.5) * 2; // Random score between -1 and 1
      sentimentData = {
        symbol: symbol,
        overall: {
          sentiment: mockScore > 0.2 ? 'positive' : mockScore < -0.2 ? 'negative' : 'neutral',
          score: mockScore,
          icon: mockScore > 0.2 ? '😃' : mockScore < -0.2 ? '😡' : '😐'
        },
        reddit: [],
        twitter: []
      };
    }

    res.json({
      success: true,
      data: sentimentData
    });

  } catch (error) {
    console.error('Social Sentiment Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching social sentiment'
    });
  }
};

// @desc    Get trending news and stocks
// @route   GET /api/news/trending
// @access  Public
const getTrendingNews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    console.log('Fetching trending news');

    let trendingData = {
      news: [],
      stocks: []
    };

    try {
      // Get general market news
      const marketNews = await finnhub.getMarketNews('general');
      
      trendingData.news = marketNews
        .map(article => {
          const sentimentAnalysis = analyzeSentiment(article.title + ' ' + (article.summary || ''));
          return {
            ...article,
            sentiment: sentimentAnalysis.sentiment,
            sentimentScore: sentimentAnalysis.score,
            sentimentIcon: sentimentAnalysis.icon
          };
        })
        .slice(0, parseInt(limit));
        
      // Mock trending stocks data
      trendingData.stocks = [
        { symbol: 'AAPL', change: '+2.34%', sentiment: 'positive' },
        { symbol: 'TSLA', change: '-1.87%', sentiment: 'negative' },
        { symbol: 'NVDA', change: '+4.56%', sentiment: 'positive' },
        { symbol: 'MSFT', change: '+1.23%', sentiment: 'positive' },
        { symbol: 'GOOGL', change: '-0.45%', sentiment: 'neutral' }
      ];
      
    } catch (error) {
      console.log('Failed to fetch trending data, using mock data');
      trendingData = {
        news: [
          {
            id: 'trending-1',
            title: 'Tech Stocks Rally on Positive Earnings Reports',
            summary: 'Major technology companies reported better than expected earnings.',
            source: 'Financial Times',
            publishedAt: new Date(),
            sentiment: 'positive',
            sentimentIcon: '😃'
          }
        ],
        stocks: [
          { symbol: 'AAPL', change: '+2.34%', sentiment: 'positive' },
          { symbol: 'TSLA', change: '-1.87%', sentiment: 'negative' }
        ]
      };
    }

    res.json({
      success: true,
      data: trendingData,
      meta: {
        newsCount: trendingData.news.length,
        stocksCount: trendingData.stocks.length
      }
    });

  } catch (error) {
    console.error('Trending News Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trending news'
    });
  }
};

module.exports = {
  getSymbolNews,
  getMarketNews,
  getSocialSentiment,
  getTrendingNews
};