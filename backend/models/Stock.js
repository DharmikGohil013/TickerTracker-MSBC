const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  market: {
    type: String,
    required: true,
    enum: ['US', 'Indian', 'Crypto'],
    default: 'US'
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  previousClose: {
    type: Number,
    required: true,
    min: 0
  },
  dayHigh: {
    type: Number,
    required: true,
    min: 0
  },
  dayLow: {
    type: Number,
    required: true,
    min: 0
  },
  volume: {
    type: Number,
    required: true,
    min: 0
  },
  marketCap: {
    type: Number,
    min: 0
  },
  peRatio: {
    type: Number,
    min: 0
  },
  dividendYield: {
    type: Number,
    min: 0,
    max: 100
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for price change calculation
stockSchema.virtual('priceChange').get(function() {
  return this.currentPrice - this.previousClose;
});

stockSchema.virtual('priceChangePercent').get(function() {
  return ((this.currentPrice - this.previousClose) / this.previousClose) * 100;
});

// Indexes for better query performance
stockSchema.index({ symbol: 1, market: 1 }, { unique: true });
stockSchema.index({ market: 1 });
stockSchema.index({ lastUpdated: -1 });

// Methods
stockSchema.methods.updatePrice = function(newPrice, volume) {
  this.currentPrice = newPrice;
  this.volume = volume;
  this.lastUpdated = new Date();
  return this.save();
};

// Static methods
stockSchema.statics.findBySymbol = function(symbol, market = 'US') {
  return this.findOne({ symbol: symbol.toUpperCase(), market, isActive: true });
};

stockSchema.statics.getTopMovers = function(market = 'US', limit = 10) {
  return this.find({ market, isActive: true })
    .sort({ lastUpdated: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Stock', stockSchema);