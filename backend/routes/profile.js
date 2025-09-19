const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  updatePreferences,
  updateAvatar,
  deleteAccount,
  getProfileStats,
} = require('../controllers/profileController');

const { protect, createRateLimit } = require('../middleware/auth');

// Rate limiting for profile routes
const profileLimiter = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per 15 minutes
  message: 'Too many profile requests, please try again later.',
});

// Validation middleware
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('country')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters'),
  body('timezone')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Timezone cannot exceed 50 characters'),
];

const updatePreferencesValidation = [
  body('defaultCurrency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD'])
    .withMessage('Invalid currency'),
  body('riskTolerance')
    .optional()
    .isIn(['conservative', 'moderate', 'aggressive'])
    .withMessage('Invalid risk tolerance'),
  body('investmentExperience')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid investment experience level'),
  body('notifications.priceAlerts')
    .optional()
    .isBoolean()
    .withMessage('Price alerts must be a boolean'),
  body('notifications.portfolioUpdates')
    .optional()
    .isBoolean()
    .withMessage('Portfolio updates must be a boolean'),
  body('notifications.marketNews')
    .optional()
    .isBoolean()
    .withMessage('Market news must be a boolean'),
  body('notifications.emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
];

const updateAvatarValidation = [
  body('avatar')
    .notEmpty()
    .withMessage('Avatar URL is required')
    .isURL()
    .withMessage('Avatar must be a valid URL'),
];

// Profile routes
router.get('/', protect, getProfile);
router.put('/', protect, profileLimiter, updateProfileValidation, updateProfile);
router.put('/preferences', protect, profileLimiter, updatePreferencesValidation, updatePreferences);
router.put('/avatar', protect, profileLimiter, updateAvatarValidation, updateAvatar);
router.get('/stats', protect, getProfileStats);
router.delete('/', protect, deleteAccount);

module.exports = router;