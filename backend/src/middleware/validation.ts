import { body } from 'express-validator';

/**
 * Validation middleware for authentication endpoints
 */

/**
 * Registration validation
 */
export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be between 1-50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be between 1-50 characters'),
  
  body('userType')
    .isIn(['STARTUP', 'INVESTOR', 'ECOSYSTEM_PLAYER', 'INDIVIDUAL'])
    .withMessage('User type must be one of: STARTUP, INVESTOR, ECOSYSTEM_PLAYER, INDIVIDUAL'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  
  body('walletAddress')
    .optional()
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Wallet address must be a valid Ethereum address'),
];

/**
 * Login validation
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Email verification validation
 */
export const validateEmailVerification = [
  body('token')
    .isLength({ min: 10 })
    .withMessage('Valid verification token is required'),
];

/**
 * Resend verification email validation
 */
export const validateResendVerification = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

/**
 * Password reset request validation
 */
export const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

/**
 * Reset password validation
 */
export const validateResetPassword = [
  body('token')
    .isLength({ min: 10 })
    .withMessage('Valid reset token is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

/**
 * Change password validation
 */
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

/**
 * Change email validation
 */
export const validateChangeEmail = [
  body('newEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

/**
 * Company creation validation
 */
export const validateCompany = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name is required and must be between 1-100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Company description is required and must be between 10-1000 characters'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),
  
  body('foundedYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Founded year must be between 1900 and current year'),
  
  body('teamSize')
    .optional()
    .isIn(['SOLO', 'SMALL_2_10', 'MEDIUM_11_50', 'LARGE_51_200', 'ENTERPRISE_200_PLUS'])
    .withMessage('Invalid team size'),
  
  body('fundingStage')
    .optional()
    .isIn(['PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D_PLUS', 'IPO', 'PROFITABLE'])
    .withMessage('Invalid funding stage'),
  
  body('blockchainPreferences')
    .optional()
    .isArray()
    .withMessage('Blockchain preferences must be an array'),
  
  body('blockchainPreferences.*')
    .optional()
    .isIn(['ETHEREUM', 'BITCOIN', 'SOLANA', 'POLYGON', 'BINANCE_SMART_CHAIN', 'AVALANCHE', 'CARDANO', 'POLKADOT', 'COSMOS', 'ARBITRUM', 'OPTIMISM', 'BASE', 'OTHER'])
    .withMessage('Invalid blockchain preference'),
]; 