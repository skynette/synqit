import { body, query } from 'express-validator';

/**
 * Validation middleware for project endpoints
 */

/**
 * Project creation/update validation
 */
export const validateProject = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name is required and must be between 1-100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Project description is required and must be between 10-2000 characters'),
  
  body('website')
    .optional()
    .isURL({
      require_protocol: true,
      allow_underscores: true,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false,
      disallow_auth: false,
      validate_length: true,
      require_host: true,
      require_valid_protocol: true,
      protocols: ['http', 'https'],
      require_tld: process.env.NODE_ENV === 'production' // Only require TLD in production
    })
    .withMessage('Website must be a valid URL'),
  
  body('logoUrl')
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ['http', 'https'],
      require_tld: process.env.NODE_ENV === 'production'
    })
    .withMessage('Logo URL must be a valid URL'),
  
  body('bannerUrl')
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ['http', 'https'],
      require_tld: process.env.NODE_ENV === 'production'
    })
    .withMessage('Banner URL must be a valid URL'),
  
  body('foundedYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Founded year must be between 1900 and current year'),
  
  body('projectType')
    .optional()
    .isIn(['AI', 'DEFI', 'GAMEFI', 'NFT', 'DAO', 'WEB3_TOOLS', 'INFRASTRUCTURE', 'METAVERSE', 'SOCIAL', 'OTHER'])
    .withMessage('Invalid project type'),
  
  body('projectStage')
    .optional()
    .isIn(['IDEA_STAGE', 'MVP', 'BETA_TESTING', 'LIVE', 'SCALING', 'MATURE'])
    .withMessage('Invalid project stage'),
  
  body('teamSize')
    .optional()
    .isIn(['SOLO', 'SMALL_2_10', 'MEDIUM_11_50', 'LARGE_51_200', 'ENTERPRISE_200_PLUS'])
    .withMessage('Invalid team size'),
  
  body('fundingStage')
    .optional()
    .isIn(['PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D_PLUS', 'IPO', 'PROFITABLE'])
    .withMessage('Invalid funding stage'),
  
  body('totalFunding')
    .optional()
    .isNumeric()
    .withMessage('Total funding must be a number'),
  
  body('isLookingForFunding')
    .optional()
    .isBoolean()
    .withMessage('isLookingForFunding must be a boolean'),
  
  body('isLookingForPartners')
    .optional()
    .isBoolean()
    .withMessage('isLookingForPartners must be a boolean'),
  
  body('tokenAvailability')
    .optional()
    .isIn(['NO_TOKEN_YET', 'PRIVATE_SALE_ONGOING', 'PUBLIC_SALE_LIVE', 'LISTED_ON_EXCHANGES', 'FULLY_DISTRIBUTED'])
    .withMessage('Invalid token availability'),
  
  body('developmentFocus')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Development focus must not exceed 200 characters'),
  
  body('contactEmail')
    .optional()
    .isEmail()
    .withMessage('Contact email must be a valid email address'),
  
  body('twitterHandle')
    .optional()
    .trim()
    .matches(/^@?[A-Za-z0-9_]{1,15}$/)
    .withMessage('Twitter handle must be a valid handle (1-15 characters)'),
  
  body('discordServer')
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ['http', 'https'],
      require_tld: process.env.NODE_ENV === 'production'
    })
    .withMessage('Discord server must be a valid URL'),
  
  body('telegramGroup')
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ['http', 'https'],
      require_tld: process.env.NODE_ENV === 'production'
    })
    .withMessage('Telegram group must be a valid URL'),
  
  body('redditCommunity')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      // Allow r/community format or full URL
      return /^r\/[A-Za-z0-9_]+$/.test(value) || /^https?:\/\/.+/.test(value);
    })
    .withMessage('Reddit community must be in format r/community or a valid URL'),
  
  body('githubUrl')
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ['http', 'https'],
      require_tld: process.env.NODE_ENV === 'production'
    })
    .withMessage('GitHub URL must be a valid URL'),
  
  body('whitepaperUrl')
    .optional()
    .isURL({
      require_protocol: true,
      protocols: ['http', 'https'],
      require_tld: process.env.NODE_ENV === 'production'
    })
    .withMessage('Whitepaper URL must be a valid URL'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  
  body('timezone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Timezone must not exceed 50 characters'),
  
  body('blockchainPreferences')
    .optional()
    .isArray()
    .withMessage('Blockchain preferences must be an array'),
  
  body('blockchainPreferences.*')
    .optional()
    .isIn(['ETHEREUM', 'BITCOIN', 'SOLANA', 'POLYGON', 'BINANCE_SMART_CHAIN', 'AVALANCHE', 'CARDANO', 'POLKADOT', 'COSMOS', 'ARBITRUM', 'OPTIMISM', 'BASE', 'OTHER'])
    .withMessage('Invalid blockchain preference'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1-30 characters'),
];

/**
 * Project search/filter validation
 */
export const validateProjectFilters = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1-100 characters'),
  
  query('projectType')
    .optional()
    .isIn(['AI', 'DEFI', 'GAMEFI', 'NFT', 'DAO', 'WEB3_TOOLS', 'INFRASTRUCTURE', 'METAVERSE', 'SOCIAL', 'OTHER'])
    .withMessage('Invalid project type'),
  
  query('projectStage')
    .optional()
    .isIn(['IDEA_STAGE', 'MVP', 'BETA_TESTING', 'LIVE', 'SCALING', 'MATURE'])
    .withMessage('Invalid project stage'),
  
  query('blockchain')
    .optional()
    .isIn(['ETHEREUM', 'BITCOIN', 'SOLANA', 'POLYGON', 'BINANCE_SMART_CHAIN', 'AVALANCHE', 'CARDANO', 'POLKADOT', 'COSMOS', 'ARBITRUM', 'OPTIMISM', 'BASE', 'OTHER'])
    .withMessage('Invalid blockchain'),
  
  query('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  
  query('isLookingForFunding')
    .optional()
    .isBoolean()
    .withMessage('isLookingForFunding must be a boolean'),
  
  query('isLookingForPartners')
    .optional()
    .isBoolean()
    .withMessage('isLookingForPartners must be a boolean'),
  
  query('tokenAvailability')
    .optional()
    .isIn(['NO_TOKEN_YET', 'PRIVATE_SALE_ONGOING', 'PUBLIC_SALE_LIVE', 'LISTED_ON_EXCHANGES', 'FULLY_DISTRIBUTED'])
    .withMessage('Invalid token availability'),
  
  query('fundingStage')
    .optional()
    .isIn(['PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'SERIES_D_PLUS', 'IPO', 'PROFITABLE'])
    .withMessage('Invalid funding stage'),
  
  query('teamSize')
    .optional()
    .isIn(['SOLO', 'SMALL_2_10', 'MEDIUM_11_50', 'LARGE_51_200', 'ENTERPRISE_200_PLUS'])
    .withMessage('Invalid team size'),
  
  query('developmentFocus')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Development focus must not exceed 200 characters'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'createdAt', 'updatedAt', 'viewCount', 'trustScore'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  query('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        // Single tag
        return value.length >= 1 && value.length <= 30;
      }
      if (Array.isArray(value)) {
        // Multiple tags
        return value.every((tag: string) => typeof tag === 'string' && tag.length >= 1 && tag.length <= 30);
      }
      return false;
    })
    .withMessage('Tags must be strings between 1-30 characters'),
];