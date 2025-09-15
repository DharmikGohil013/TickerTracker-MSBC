const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Get token from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token provided',
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized - User not found',
        });
      }
      
      // Check if user account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts',
        });
      }
      
      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - Invalid token',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user's email is verified
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address to access this feature',
    });
  }
  next();
};

// Check subscription status for premium features
const requireActiveSubscription = (req, res, next) => {
  const { subscription } = req.user;
  
  if (!subscription.isActive || 
      (subscription.endDate && subscription.endDate < new Date())) {
    return res.status(403).json({
      success: false,
      message: 'Active subscription required to access this feature',
    });
  }
  next();
};

// Check API usage limits
const checkAPILimit = async (req, res, next) => {
  try {
    const user = req.user;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Reset monthly count if it's a new month
    if (user.apiUsage.lastReset < monthStart) {
      user.apiUsage.requestCount = 0;
      user.apiUsage.lastReset = now;
      await user.save();
    }
    
    // Check if user has exceeded their monthly limit
    if (user.apiUsage.requestCount >= user.apiUsage.monthlyLimit) {
      return res.status(429).json({
        success: false,
        message: 'Monthly API limit exceeded. Please upgrade your subscription.',
        limit: user.apiUsage.monthlyLimit,
        used: user.apiUsage.requestCount,
      });
    }
    
    // Increment request count
    user.apiUsage.requestCount += 1;
    await user.save();
    
    next();
  } catch (error) {
    console.error('API limit check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking API limits',
    });
  }
};

// Optional auth - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Get token from cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    // If no token, continue without setting user
    if (!token) {
      return next();
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && !user.isLocked) {
        req.user = user;
      }
    } catch (error) {
      // Invalid token, but continue without user
      console.log('Optional auth - invalid token:', error.message);
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if there's an error
  }
};

// Rate limiting for specific routes
const createRateLimit = (options = {}) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 5, // Limit each IP to 5 requests per windowMs
    message: options.message || 'Too many requests, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise IP
      return req.user ? req.user._id.toString() : req.ip;
    },
  });
};

module.exports = {
  protect,
  authorize,
  requireEmailVerification,
  requireActiveSubscription,
  checkAPILimit,
  optionalAuth,
  createRateLimit,
};
