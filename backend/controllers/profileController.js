const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        timezone: user.timezone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
        subscription: user.subscription,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // Financial Information
        portfolio: user.getFinancialSummary(),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const allowedFields = [
      'firstName', 
      'lastName', 
      'avatar', 
      'phone', 
      'bio', 
      'dateOfBirth', 
      'country', 
      'timezone'
    ];
    
    const updates = {};

    // Only include allowed fields that are provided
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Handle username separately due to uniqueness constraint
    if (req.body.username && req.body.username !== req.user.username) {
      // Check if username is already taken
      const existingUser = await User.findOne({ 
        username: req.body.username,
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken',
        });
      }
      
      updates.username = req.body.username;
    }

    // If no fields to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    console.log(`✅ Profile updated successfully for user: ${user.email}`);
    console.log(`📝 Updated fields:`, Object.keys(updates));

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        timezone: user.timezone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        updatedAt: user.updatedAt,
        // Include basic financial info
        balances: user.portfolio.balances,
        dailyPnL: user.portfolio.dailyPnL,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} is already taken`,
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/profile/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update preferences with proper validation
    const updateFields = {};
    
    if (req.body.defaultCurrency) {
      updateFields['preferences.defaultCurrency'] = req.body.defaultCurrency;
    }
    
    if (req.body.riskTolerance) {
      updateFields['preferences.riskTolerance'] = req.body.riskTolerance;
    }
    
    if (req.body.investmentExperience) {
      updateFields['preferences.investmentExperience'] = req.body.investmentExperience;
    }

    // Handle notifications object
    if (req.body.notifications) {
      const notificationFields = [
        'priceAlerts', 
        'portfolioUpdates', 
        'marketNews', 
        'emailNotifications'
      ];
      
      notificationFields.forEach(field => {
        if (req.body.notifications[field] !== undefined) {
          updateFields[`preferences.notifications.${field}`] = req.body.notifications[field];
        }
      });
    }

    // If no fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid preference fields provided for update',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    console.log(`✅ Preferences updated successfully for user: ${updatedUser.email}`);
    console.log(`📝 Updated preference fields:`, Object.keys(updateFields));

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: updatedUser.preferences,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating preferences',
    });
  }
};

// @desc    Update user avatar
// @route   PUT /api/profile/avatar
// @access  Private
const updateAvatar = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true, runValidators: true }
    );

    console.log(`✅ Avatar updated successfully for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: user.avatar,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating avatar',
    });
  }
};

// @desc    Get user profile statistics
// @route   GET /api/profile/stats
// @access  Private
const getProfileStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate days since registration
    const daysSinceRegistration = Math.floor(
      (new Date() - user.createdAt) / (1000 * 60 * 60 * 24)
    );

    // Calculate profile completion percentage
    const profileFields = [
      user.firstName,
      user.lastName,
      user.avatar,
      user.phone,
      user.bio,
      user.dateOfBirth,
      user.country,
      user.timezone,
    ];
    
    const completedFields = profileFields.filter(field => field && field.trim() !== '').length;
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

    // Get comprehensive financial summary
    const financialSummary = user.getFinancialSummary();
    
    // Calculate trading performance metrics
    const initialInvestmentUSD = 10000;
    const initialInvestmentINR = 1000000;
    const currentBalanceUSD = user.portfolio.balances.usd;
    const currentBalanceINR = user.portfolio.balances.inr;
    
    // Performance calculations
    const usdGainLoss = currentBalanceUSD - initialInvestmentUSD;
    const inrGainLoss = currentBalanceINR - initialInvestmentINR;
    const usdReturnPercent = ((usdGainLoss / initialInvestmentUSD) * 100);
    const inrReturnPercent = ((inrGainLoss / initialInvestmentINR) * 100);

    const stats = {
      accountAge: {
        days: daysSinceRegistration,
        createdAt: user.createdAt,
      },
      profileCompletion: {
        percentage: profileCompletion,
        completedFields: completedFields,
        totalFields: profileFields.length,
      },
      // Financial Portfolio Statistics
      portfolio: {
        // Current Balances
        currentBalances: {
          usd: {
            amount: currentBalanceUSD,
            currency: 'USD',
            symbol: '$'
          },
          inr: {
            amount: currentBalanceINR,
            currency: 'INR',
            symbol: '₹'
          }
        },
        // Initial Investment
        initialInvestment: {
          usd: {
            amount: initialInvestmentUSD,
            currency: 'USD',
            symbol: '$'
          },
          inr: {
            amount: initialInvestmentINR,
            currency: 'INR',
            symbol: '₹'
          }
        },
        // Performance Metrics
        performance: {
          usd: {
            gainLoss: usdGainLoss,
            returnPercent: usdReturnPercent,
            status: usdGainLoss >= 0 ? 'profit' : 'loss'
          },
          inr: {
            gainLoss: inrGainLoss,
            returnPercent: inrReturnPercent,
            status: inrGainLoss >= 0 ? 'profit' : 'loss'
          }
        },
        // Daily P&L
        dailyPnL: {
          usd: user.portfolio.dailyPnL.usd,
          inr: user.portfolio.dailyPnL.inr,
          date: user.portfolio.dailyPnL.date,
          usdStatus: user.portfolio.dailyPnL.usd >= 0 ? 'profit' : 'loss',
          inrStatus: user.portfolio.dailyPnL.inr >= 0 ? 'profit' : 'loss'
        },
        // Total P&L (Lifetime)
        totalPnL: {
          usd: user.portfolio.totalPnL.usd,
          inr: user.portfolio.totalPnL.inr,
          usdStatus: user.portfolio.totalPnL.usd >= 0 ? 'profit' : 'loss',
          inrStatus: user.portfolio.totalPnL.inr >= 0 ? 'profit' : 'loss'
        },
        // Portfolio Statistics
        holdings: {
          count: user.portfolio.holdings.length,
          totalValue: financialSummary.portfolioValue.totalCombined,
          diversity: user.portfolio.holdings.length > 0 ? 
            Math.min(100, (user.portfolio.holdings.length / 10) * 100) : 0 // Max 100% at 10 holdings
        },
        // Trading Statistics
        trading: {
          totalTrades: user.portfolio.tradingStats.totalTrades,
          winningTrades: user.portfolio.tradingStats.winningTrades,
          losingTrades: user.portfolio.tradingStats.losingTrades,
          winRate: user.portfolio.tradingStats.winRate,
          bestTrade: user.portfolio.tradingStats.bestTrade,
          worstTrade: user.portfolio.tradingStats.worstTrade
        }
      },
      preferences: {
        watchlistCount: user.preferences.watchlist?.length || 0,
        portfolioCount: user.preferences.portfolios?.length || 0,
        defaultCurrency: user.preferences.defaultCurrency,
        riskTolerance: user.preferences.riskTolerance,
        investmentExperience: user.preferences.investmentExperience,
      },
      subscription: {
        plan: user.subscription.plan,
        isActive: user.subscription.isActive,
        daysRemaining: user.subscription.endDate ? 
          Math.max(0, Math.ceil((user.subscription.endDate - new Date()) / (1000 * 60 * 60 * 24))) : 
          null,
      },
      activity: {
        lastLogin: user.lastLogin,
        emailVerified: user.isEmailVerified,
        totalLogins: user.loginAttempts || 0,
      },
      apiUsage: user.apiUsage,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get profile stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting profile statistics',
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/profile
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const { password, confirmText } = req.body;

    // Require password for account deletion
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account',
      });
    }

    // Require confirmation text
    if (confirmText !== 'DELETE') {
      return res.status(400).json({
        success: false,
        message: 'Please type "DELETE" to confirm account deletion',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    // Prevent admin from deleting their own account
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be deleted',
      });
    }

    // TODO: Clean up related data (portfolios, alerts, etc.)
    // This would be handled by pre-remove middleware in the User model

    await User.findByIdAndDelete(req.user.id);

    console.log(`🗑️ User account deleted: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting account',
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  updateAvatar,
  getProfileStats,
  deleteAccount,
};