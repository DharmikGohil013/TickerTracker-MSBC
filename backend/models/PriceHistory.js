const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  stockSymbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  market: {
    type: String,
    required: true,
    enum: ['US', 'Indian', 'Crypto'],
    default: 'US'
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  open: {
    type: Number,
    required: true,
    min: 0
  },
  high: {
    type: Number,
    required: true,
    min: 0
  },
  low: {
    type: Number,
    required: true,
    min: 0
  },
  close: {
    type: Number,
    required: true,
    min: 0
  },
  volume: {
    type: Number,
    required: true,
    min: 0
  },
  adjustedClose: {
    type: Number,
    min: 0
  },
  interval: {
    type: String,
    enum: ['1min', '5min', '15min', '30min', '1hour', '1day', '1week', '1month'],
    default: '1day'
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
priceHistorySchema.index({ stockSymbol: 1, market: 1, date: -1 });
priceHistorySchema.index({ stockSymbol: 1, interval: 1, date: -1 });
priceHistorySchema.index({ date: -1 });

// Virtual for price change calculation
priceHistorySchema.virtual('priceChange').get(function() {
  return this.close - this.open;
});

priceHistorySchema.virtual('priceChangePercent').get(function() {
  return ((this.close - this.open) / this.open) * 100;
});

// Static methods
priceHistorySchema.statics.getHistoryBySymbol = function(symbol, market = 'US', days = 30, interval = '1day') {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    stockSymbol: symbol.toUpperCase(),
    market,
    interval,
    date: { $gte: startDate }
  }).sort({ date: 1 });
};

priceHistorySchema.statics.getLatestPrice = function(symbol, market = 'US', interval = '1day') {
  return this.findOne({
    stockSymbol: symbol.toUpperCase(),
    market,
    interval
  }).sort({ date: -1 });
};

priceHistorySchema.statics.addPriceData = function(stockData) {
  return this.create(stockData);
};

// Pre-save middleware to validate high/low prices
priceHistorySchema.pre('save', function(next) {
  if (this.high < this.low) {
    next(new Error('High price cannot be less than low price'));
  }
  if (this.close > this.high || this.close < this.low) {
    next(new Error('Close price must be between high and low prices'));
  }
  if (this.open > this.high || this.open < this.low) {
    next(new Error('Open price must be between high and low prices'));
  }
  next();
});

module.exports = mongoose.model('PriceHistory', priceHistorySchema);