const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  summary: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    required: true,
    trim: true
  },
  sourceUrl: {
    type: String,
    required: true,
    trim: true
  },
  publishedAt: {
    type: Date,
    required: true,
    index: true
  },
  relatedStocks: [{
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
  }],
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1,
    default: 0
  },
  category: {
    type: String,
    enum: ['earnings', 'merger', 'regulatory', 'market', 'company', 'economic', 'other'],
    default: 'other'
  },
  imageUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ 'relatedStocks.symbol': 1, 'relatedStocks.market': 1 });
newsSchema.index({ sentiment: 1 });
newsSchema.index({ category: 1 });
newsSchema.index({ source: 1 });

// Virtual for sentiment icon
newsSchema.virtual('sentimentIcon').get(function() {
  switch(this.sentiment) {
    case 'positive': return '😃';
    case 'negative': return '😡';
    default: return '😐';
  }
});

// Static methods
newsSchema.statics.getNewsByStock = function(symbol, market = 'US', limit = 10) {
  return this.find({
    'relatedStocks.symbol': symbol.toUpperCase(),
    'relatedStocks.market': market,
    isActive: true
  })
  .sort({ publishedAt: -1 })
  .limit(limit);
};

newsSchema.statics.getLatestNews = function(limit = 20) {
  return this.find({ isActive: true })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

newsSchema.statics.getNewsByCategory = function(category, limit = 10) {
  return this.find({ category, isActive: true })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

newsSchema.statics.getNewsBySentiment = function(sentiment, limit = 10) {
  return this.find({ sentiment, isActive: true })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Instance methods
newsSchema.methods.addRelatedStock = function(symbol, market = 'US') {
  if (!this.relatedStocks.some(stock => stock.symbol === symbol.toUpperCase() && stock.market === market)) {
    this.relatedStocks.push({ symbol: symbol.toUpperCase(), market });
    return this.save();
  }
  return this;
};

newsSchema.methods.updateSentiment = function(sentiment, score = 0) {
  this.sentiment = sentiment;
  this.sentimentScore = score;
  return this.save();
};

module.exports = mongoose.model('News', newsSchema);