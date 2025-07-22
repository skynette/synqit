import { body } from 'express-validator';

export const profileValidation = {
  updateUserProfile: [
    body('firstName')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio must be less than 500 characters'),
    body('walletAddress')
      .optional()
      .isLength({ min: 26, max: 62 })
      .withMessage('Invalid wallet address format'),
    body('profileImage')
      .optional()
      .isURL()
      .withMessage('Profile image must be a valid URL')
  ],

  updateCompanyProfile: [
    body('name')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Company name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .isLength({ max: 5000 })
      .withMessage('Description must be less than 5000 characters'),
    body('website')
      .optional()
      .isURL()
      .withMessage('Website must be a valid URL'),
    body('logoUrl')
      .optional()
      .isURL()
      .withMessage('Logo URL must be a valid URL'),
    body('foundedYear')
      .optional()
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage('Founded year must be a valid year'),
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
      .isLength({ max: 100 })
      .withMessage('Development focus must be less than 100 characters'),
    body('totalFunding')
      .optional()
      .isDecimal()
      .withMessage('Total funding must be a valid decimal number'),
    body('isLookingForFunding')
      .optional()
      .isBoolean()
      .withMessage('Looking for funding must be a boolean'),
    body('isLookingForPartners')
      .optional()
      .isBoolean()
      .withMessage('Looking for partners must be a boolean'),
    body('contactEmail')
      .optional()
      .isEmail()
      .withMessage('Contact email must be a valid email'),
    body('twitterHandle')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Twitter handle must be less than 50 characters'),
    body('discordServer')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Discord server must be less than 100 characters'),
    body('telegramGroup')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Telegram group must be less than 100 characters'),
    body('country')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Country must be less than 50 characters'),
    body('city')
      .optional()
      .isLength({ max: 50 })
      .withMessage('City must be less than 50 characters'),
    body('timezone')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Timezone must be less than 50 characters')
  ],

  changePassword: [
    body('oldPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match new password');
        }
        return true;
      })
  ],

  updateBlockchainPreferences: [
    body('preferences')
      .isArray()
      .withMessage('Preferences must be an array'),
    body('preferences.*.blockchain')
      .isIn(['ETHEREUM', 'SOLANA', 'MVP', 'BINANCE_SMART_CHAIN', 'POLYGON', 'AVALANCHE', 'TORONET', 'OTHER'])
      .withMessage('Invalid blockchain type'),
    body('preferences.*.isPrimary')
      .optional()
      .isBoolean()
      .withMessage('isPrimary must be a boolean')
  ]
};