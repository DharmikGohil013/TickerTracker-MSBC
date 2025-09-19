const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['price_up', 'price_down', 'volume_spike', 'sentiment_positive', 'sentiment_negative', 'breaking_news', 'technical_signal', 'earnings_alert'],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  relatedStock: {
    symbol: {
      type: String,
      uppercase: true,
      trim: true
    },
    market: {
      type: String,
      enum: ['US', 'Indian', 'Crypto'],
      default: 'US'
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  metadata: {
    currentPrice: Number,
    previousPrice: Number,
    priceChange: Number,
    volume: Number,
    sentimentScore: Number,
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News'
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
alertSchema.index({ userId: 1, createdAt: -1 });
alertSchema.index({ type: 1 });
alertSchema.index({ priority: 1 });
alertSchema.index({ isRead: 1 });
alertSchema.index({ 'relatedStock.symbol': 1, 'relatedStock.market': 1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for alert color coding
alertSchema.virtual('colorCode').get(function() {
  switch(this.type) {
    case 'price_down':
    case 'sentiment_negative':
      return 'red';
    case 'price_up':
    case 'sentiment_positive':
      return 'green';
    case 'volume_spike':
    case 'earnings_alert':
      return 'orange';
    case 'breaking_news':
    case 'technical_signal':
      return 'blue';
    default:
      return 'gray';
  }
});

// Virtual for emoji icon
alertSchema.virtual('emoji').get(function() {
  switch(this.type) {
    case 'price_down':
    case 'sentiment_negative':
      return '🔴';
    case 'price_up':
    case 'sentiment_positive':
      return '🟢';
    case 'volume_spike':
    case 'earnings_alert':
      return '🟡';
    case 'breaking_news':
    case 'technical_signal':
      return '🔵';
    default:
      return '⚪';
  }
});

// Static methods
alertSchema.statics.getUserAlerts = function(userId, limit = 20, unreadOnly = false) {
  const query = { userId, isActive: true };
  if (unreadOnly) {
    query.isRead = false;
  }
  
  return this.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .populate('metadata.newsId', 'title source publishedAt');
};

alertSchema.statics.getAlertsByStock = function(symbol, market = 'US', limit = 10) {
  return this.find({
    'relatedStock.symbol': symbol.toUpperCase(),
    'relatedStock.market': market,
    isActive: true
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

alertSchema.statics.createPriceAlert = function(userId, symbol, market, currentPrice, previousPrice, type) {
  const priceChange = currentPrice - previousPrice;
  const percentChange = (priceChange / previousPrice) * 100;
  
  const alertData = {
    userId,
    type,
    title: 'Price Alert',
    message: `${symbol} price ${type === 'price_up' ? 'up' : 'down'} ${Math.abs(percentChange).toFixed(2)}% in 1hr`,
    relatedStock: { symbol: symbol.toUpperCase(), market },
    priority: Math.abs(percentChange) > 5 ? 'high' : 'medium',
    metadata: {
      currentPrice,
      previousPrice,
      priceChange
    }
  };
  
  return this.create(alertData);
};

alertSchema.statics.createSentimentAlert = function(userId, symbol, market, sentiment, sentimentScore) {
  const type = sentiment === 'positive' ? 'sentiment_positive' : 'sentiment_negative';
  
  const alertData = {
    userId,
    type,
    title: 'Sentiment Alert',
    message: `${symbol} ${sentiment} sentiment trending on social media`,
    relatedStock: { symbol: symbol.toUpperCase(), market },
    priority: Math.abs(sentimentScore) > 0.7 ? 'high' : 'medium',
    metadata: {
      sentimentScore
    }
  };
  
  return this.create(alertData);
};

// Instance methods
alertSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

alertSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

module.exports = mongoose.model('Alert', alertSchema);