const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    default: 'My Watchlist'
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  stocks: [{
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    market: {
      type: String,
      required: true,
      enum: ['US', 'Indian', 'Crypto'],
      default: 'US'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    alertSettings: {
      priceAlerts: {
        enabled: {
          type: Boolean,
          default: false
        },
        threshold: {
          type: Number,
          min: 0,
          max: 100,
          default: 5 // 5% change
        }
      },
      volumeAlerts: {
        enabled: {
          type: Boolean,
          default: false
        },
        multiplier: {
          type: Number,
          min: 1,
          default: 2 // 2x average volume
        }
      },
      newsAlerts: {
        enabled: {
          type: Boolean,
          default: true
        }
      }
    }
  }],
  isDefault: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#87CEEB',
    match: /^#[0-9A-F]{6}$/i
  }
}, {
  timestamps: true
});

// Indexes
watchlistSchema.index({ userId: 1, createdAt: -1 });
watchlistSchema.index({ userId: 1, isDefault: 1 });
watchlistSchema.index({ 'stocks.symbol': 1, 'stocks.market': 1 });

// Validation: Only one default watchlist per user
watchlistSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Virtual for stock count
watchlistSchema.virtual('stockCount').get(function() {
  return this.stocks.length;
});

// Static methods
watchlistSchema.statics.getUserWatchlists = function(userId) {
  return this.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
};

watchlistSchema.statics.getDefaultWatchlist = function(userId) {
  return this.findOne({ userId, isDefault: true });
};

watchlistSchema.statics.findByUserAndId = function(userId, watchlistId) {
  return this.findOne({ _id: watchlistId, userId });
};

// Instance methods
watchlistSchema.methods.addStock = function(symbol, market = 'US', alertSettings = {}) {
  const stockExists = this.stocks.some(
    stock => stock.symbol === symbol.toUpperCase() && stock.market === market
  );
  
  if (!stockExists) {
    const defaultAlertSettings = {
      priceAlerts: { enabled: false, threshold: 5 },
      volumeAlerts: { enabled: false, multiplier: 2 },
      newsAlerts: { enabled: true }
    };
    
    this.stocks.push({
      symbol: symbol.toUpperCase(),
      market,
      alertSettings: { ...defaultAlertSettings, ...alertSettings }
    });
    
    return this.save();
  }
  return this;
};

watchlistSchema.methods.removeStock = function(symbol, market = 'US') {
  this.stocks = this.stocks.filter(
    stock => !(stock.symbol === symbol.toUpperCase() && stock.market === market)
  );
  return this.save();
};

watchlistSchema.methods.updateStockAlerts = function(symbol, market, alertSettings) {
  const stock = this.stocks.find(
    s => s.symbol === symbol.toUpperCase() && s.market === market
  );
  
  if (stock) {
    stock.alertSettings = { ...stock.alertSettings, ...alertSettings };
    return this.save();
  }
  return this;
};

watchlistSchema.methods.hasStock = function(symbol, market = 'US') {
  return this.stocks.some(
    stock => stock.symbol === symbol.toUpperCase() && stock.market === market
  );
};

watchlistSchema.methods.getStockSymbols = function(market = null) {
  let stocks = this.stocks;
  if (market) {
    stocks = stocks.filter(stock => stock.market === market);
  }
  return stocks.map(stock => stock.symbol);
};

module.exports = mongoose.model('Watchlist', watchlistSchema);