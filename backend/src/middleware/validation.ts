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
  
  body('projectType')
    .optional()
    .isIn(['AI', 'DEFI', 'GAMEFI', 'NFT', 'DAO', 'WEB3_TOOLS', 'OTHER'])
    .withMessage('Invalid project type'),
  
  body('projectStage')
    .optional()
    .isIn(['IDEA_STAGE', 'MVP', 'BETA_TESTING', 'LIVE', 'TESTING', 'SCALING'])
    .withMessage('Invalid project stage'),
  
  body('tokenAvailability')
    .optional()
    .isIn(['NO_TOKEN_YET', 'PRIVATE_SALE_ONGOING', 'PUBLIC_SALE_LIVE', 'LISTED_ON_EXCHANGES'])
    .withMessage('Invalid token availability'),
  
  body('developmentFocus')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Development focus must not exceed 100 characters'),
  
  body('blockchainPreferences')
    .optional()
    .isArray()
    .withMessage('Blockchain preferences must be an array'),
  
  body('blockchainPreferences.*')
    .optional()
    .isIn(['ETHEREUM', 'SOLANA', 'MVP', 'BINANCE_SMART_CHAIN', 'POLYGON', 'AVALANCHE', 'TORONET', 'OTHER'])
    .withMessage('Invalid blockchain preference'),
];

/**
 * Partnership creation validation
 */
export const validateCreatePartnership = [
  body('receiverProjectId')
    .notEmpty()
    .isString()
    .withMessage('Receiver project ID is required'),

  body('partnershipType')
    .isIn([
      'TECHNICAL_INTEGRATION',
      'MARKETING_COLLABORATION', 
      'FUNDING_OPPORTUNITY',
      'ADVISORY_PARTNERSHIP',
      'JOINT_VENTURE',
      'ECOSYSTEM_PARTNERSHIP',
      'SERVICE_PROVIDER',
      'TALENT_EXCHANGE',
      'OTHER'
    ])
    .withMessage('Invalid partnership type'),

  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be between 1-200 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description is required and must be between 10-1000 characters'),

  body('proposedTerms')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Proposed terms must not exceed 2000 characters'),
]; 