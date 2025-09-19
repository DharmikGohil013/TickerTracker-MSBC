const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  avatar: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: null,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  country: {
    type: String,
    maxlength: [50, 'Country cannot exceed 50 characters'],
    default: null,
    trim: true,
  },
  timezone: {
    type: String,
    maxlength: [50, 'Timezone cannot exceed 50 characters'],
    default: null,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    default: null,
  },
  emailVerificationExpires: {
    type: Date,
    default: null,
  },
  emailOTP: {
    type: String,
    default: null,
  },
  emailOTPExpires: {
    type: Date,
    default: null,
  },
  emailOTPAttempts: {
    type: Number,
    default: 0,
  },
  registrationStatus: {
    type: String,
    enum: ['pending', 'verified', 'incomplete'],
    default: 'pending',
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
  // Stock market specific fields
  preferences: {
    defaultCurrency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD'],
      default: 'USD',
    },
    watchlist: [{
      symbol: {
        type: String,
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    portfolios: [{
      name: {
        type: String,
        required: true,
      },
      description: String,
      isDefault: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    notifications: {
      priceAlerts: {
        type: Boolean,
        default: true,
      },
      portfolioUpdates: {
        type: Boolean,
        default: true,
      },
      marketNews: {
        type: Boolean,
        default: false,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
    riskTolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate',
    },
    investmentExperience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner',
    },
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free',
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  apiUsage: {
    requestCount: {
      type: Number,
      default: 0,
    },
    lastReset: {
      type: Date,
      default: Date.now,
    },
    monthlyLimit: {
      type: Number,
      default: 1000, // Free tier limit
    },
  },
  // Financial Portfolio Tracking
  portfolio: {
    // Account Balances
    balances: {
      usd: {
        type: Number,
        default: 10000, // Starting balance: $10,000 USD
      },
      inr: {
        type: Number,
        default: 1000000, // Starting balance: ₹10,00,000 INR
      },
      // Add other currencies as needed
    },
    // Daily Profit & Loss Tracking
    dailyPnL: {
      usd: {
        type: Number,
        default: 0, // Daily P&L in USD
      },
      inr: {
        type: Number,
        default: 0, // Daily P&L in INR
      },
      date: {
        type: Date,
        default: Date.now, // Date for current P&L calculation
      },
    },
    // Overall Portfolio Statistics
    totalPnL: {
      usd: {
        type: Number,
        default: 0, // Total lifetime P&L in USD
      },
      inr: {
        type: Number,
        default: 0, // Total lifetime P&L in INR
      },
    },
    // Portfolio Performance History
    performanceHistory: [{
      date: {
        type: Date,
        default: Date.now,
      },
      balanceUSD: {
        type: Number,
        default: 10000,
      },
      balanceINR: {
        type: Number,
        default: 1000000,
      },
      dailyPnLUSD: {
        type: Number,
        default: 0,
      },
      dailyPnLINR: {
        type: Number,
        default: 0,
      },
      totalValue: {
        type: Number,
        default: 0, // Total portfolio value in preferred currency
      },
    }],
    // Holdings and Positions
    holdings: [{
      symbol: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
      averagePrice: {
        type: Number,
        required: true,
        default: 0,
      },
      currency: {
        type: String,
        enum: ['USD', 'INR'],
        default: 'USD',
      },
      purchaseDate: {
        type: Date,
        default: Date.now,
      },
      currentValue: {
        type: Number,
        default: 0,
      },
      unrealizedPnL: {
        type: Number,
        default: 0,
      },
    }],
    // Trading Statistics
    tradingStats: {
      totalTrades: {
        type: Number,
        default: 0,
      },
      winningTrades: {
        type: Number,
        default: 0,
      },
      losingTrades: {
        type: Number,
        default: 0,
      },
      winRate: {
        type: Number,
        default: 0, // Calculated as percentage
      },
      bestTrade: {
        symbol: String,
        profit: { type: Number, default: 0 },
        date: Date,
      },
      worstTrade: {
        symbol: String,
        loss: { type: Number, default: 0 },
        date: Date,
      },
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'preferences.watchlist.symbol': 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to handle failed login attempts
userSchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we're at max attempts and it's not locked already, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Static method to find user by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  }).select('+password');
};

// Static method to add stock to watchlist
userSchema.methods.addToWatchlist = async function(symbol) {
  const existingSymbol = this.preferences.watchlist.find(
    item => item.symbol === symbol.toUpperCase()
  );
  
  if (!existingSymbol) {
    this.preferences.watchlist.push({
      symbol: symbol.toUpperCase(),
      addedAt: new Date()
    });
    await this.save();
  }
  
  return this;
};

// Static method to remove stock from watchlist
userSchema.methods.removeFromWatchlist = async function(symbol) {
  this.preferences.watchlist = this.preferences.watchlist.filter(
    item => item.symbol !== symbol.toUpperCase()
  );
  await this.save();
  return this;
};

// Method to generate and set email OTP
userSchema.methods.generateEmailOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  this.emailOTP = otp;
  this.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  this.emailOTPAttempts = 0;
  
  return otp;
};

// Method to verify email OTP
userSchema.methods.verifyEmailOTP = function(otp) {
  // Check if OTP exists and is not expired
  if (!this.emailOTP || !this.emailOTPExpires) {
    return { success: false, message: 'No OTP found. Please request a new one.' };
  }
  
  if (this.emailOTPExpires < new Date()) {
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }
  
  // Check attempt limits (max 5 attempts)
  if (this.emailOTPAttempts >= 5) {
    return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
  }
  
  // Verify OTP
  if (this.emailOTP !== otp) {
    this.emailOTPAttempts += 1;
    return { 
      success: false, 
      message: `Invalid OTP. ${5 - this.emailOTPAttempts} attempts remaining.` 
    };
  }
  
  // OTP is valid - clear OTP fields and verify email
  this.emailOTP = undefined;
  this.emailOTPExpires = undefined;
  this.emailOTPAttempts = 0;
  this.isEmailVerified = true;
  this.registrationStatus = 'verified';
  
  return { success: true, message: 'Email verified successfully!' };
};

// Method to clear expired OTP
userSchema.methods.clearExpiredOTP = function() {
  if (this.emailOTPExpires && this.emailOTPExpires < new Date()) {
    this.emailOTP = undefined;
    this.emailOTPExpires = undefined;
    this.emailOTPAttempts = 0;
  }
};

// ===================
// FINANCIAL METHODS
// ===================

// Method to reset daily P&L (should be called daily)
userSchema.methods.resetDailyPnL = function() {
  const today = new Date();
  const lastPnLDate = this.portfolio.dailyPnL.date;
  
  // Check if it's a new day
  if (!lastPnLDate || lastPnLDate.toDateString() !== today.toDateString()) {
    // Store yesterday's P&L in history before resetting
    if (lastPnLDate) {
      this.portfolio.performanceHistory.push({
        date: lastPnLDate,
        balanceUSD: this.portfolio.balances.usd,
        balanceINR: this.portfolio.balances.inr,
        dailyPnLUSD: this.portfolio.dailyPnL.usd,
        dailyPnLINR: this.portfolio.dailyPnL.inr,
        totalValue: this.portfolio.balances.usd + (this.portfolio.balances.inr / 75) // Assuming 1 USD = 75 INR
      });
    }
    
    // Reset daily P&L for new day
    this.portfolio.dailyPnL.usd = 0;
    this.portfolio.dailyPnL.inr = 0;
    this.portfolio.dailyPnL.date = today;
    
    console.log(`📅 Daily P&L reset for user: ${this.email}`);
  }
};

// Method to update daily P&L
userSchema.methods.updateDailyPnL = function(amountUSD = 0, amountINR = 0) {
  // Ensure daily P&L is current
  this.resetDailyPnL();
  
  // Update daily P&L
  this.portfolio.dailyPnL.usd += amountUSD;
  this.portfolio.dailyPnL.inr += amountINR;
  
  // Update total lifetime P&L
  this.portfolio.totalPnL.usd += amountUSD;
  this.portfolio.totalPnL.inr += amountINR;
  
  console.log(`💰 P&L updated for ${this.email}: USD ${amountUSD > 0 ? '+' : ''}${amountUSD}, INR ${amountINR > 0 ? '+' : ''}${amountINR}`);
};

// Method to update account balance
userSchema.methods.updateBalance = function(amountUSD = 0, amountINR = 0) {
  this.portfolio.balances.usd += amountUSD;
  this.portfolio.balances.inr += amountINR;
  
  // Prevent negative balances
  if (this.portfolio.balances.usd < 0) this.portfolio.balances.usd = 0;
  if (this.portfolio.balances.inr < 0) this.portfolio.balances.inr = 0;
  
  console.log(`💳 Balance updated for ${this.email}: USD $${this.portfolio.balances.usd}, INR ₹${this.portfolio.balances.inr}`);
};

// Method to add a stock holding
userSchema.methods.addHolding = function(symbol, quantity, price, currency = 'USD') {
  const existingHolding = this.portfolio.holdings.find(h => h.symbol === symbol && h.currency === currency);
  
  if (existingHolding) {
    // Update existing holding (average price calculation)
    const totalQuantity = existingHolding.quantity + quantity;
    const totalValue = (existingHolding.quantity * existingHolding.averagePrice) + (quantity * price);
    existingHolding.averagePrice = totalValue / totalQuantity;
    existingHolding.quantity = totalQuantity;
    existingHolding.currentValue = totalQuantity * price;
  } else {
    // Add new holding
    this.portfolio.holdings.push({
      symbol: symbol,
      quantity: quantity,
      averagePrice: price,
      currency: currency,
      currentValue: quantity * price,
      unrealizedPnL: 0
    });
  }
  
  console.log(`📈 Added holding for ${this.email}: ${quantity} shares of ${symbol} at ${currency} ${price}`);
};

// Method to calculate portfolio value
userSchema.methods.calculatePortfolioValue = function() {
  let totalValueUSD = this.portfolio.balances.usd;
  let totalValueINR = this.portfolio.balances.inr;
  
  // Add value from holdings
  this.portfolio.holdings.forEach(holding => {
    if (holding.currency === 'USD') {
      totalValueUSD += holding.currentValue;
    } else if (holding.currency === 'INR') {
      totalValueINR += holding.currentValue;
    }
  });
  
  return {
    totalUSD: totalValueUSD,
    totalINR: totalValueINR,
    totalCombined: totalValueUSD + (totalValueINR / 75) // Convert INR to USD for combined value
  };
};

// Method to get financial summary
userSchema.methods.getFinancialSummary = function() {
  this.resetDailyPnL(); // Ensure current day data
  
  const portfolioValue = this.calculatePortfolioValue();
  const initialInvestment = 10000 + (1000000 / 75); // Initial USD + INR converted to USD
  const totalReturn = portfolioValue.totalCombined - initialInvestment;
  const totalReturnPercent = ((totalReturn / initialInvestment) * 100);
  
  return {
    balances: this.portfolio.balances,
    dailyPnL: this.portfolio.dailyPnL,
    totalPnL: this.portfolio.totalPnL,
    portfolioValue: portfolioValue,
    performance: {
      totalReturn: totalReturn,
      totalReturnPercent: totalReturnPercent,
      initialInvestment: initialInvestment,
    },
    tradingStats: this.portfolio.tradingStats,
    holdingsCount: this.portfolio.holdings.length,
    lastUpdated: new Date()
  };
};

// Pre-remove middleware to clean up related data
userSchema.pre('remove', function(next) {
  // Here you could add logic to clean up related data
  // like user's portfolios, alerts, etc.
  next();
});

module.exports = mongoose.model('User', userSchema);
