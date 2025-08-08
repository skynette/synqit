/**
 * Companies Routes
 * 
 * This module defines all routes for company management and discovery functionality.
 * It handles company listings, search, filtering, statistics, and detailed company views
 * for the Synqit platform.
 * 
 * Routes:
 * - GET /api/companies - Get all companies with filtering
 * - GET /api/companies/featured - Get featured companies
 * - GET /api/companies/trending - Get trending companies
 * - GET /api/companies/search - Advanced company search
 * - GET /api/companies/stats - Get company statistics
 * - GET /api/companies/by-type/:type - Get companies by project type
 * - GET /api/companies/:id - Get company details
 * - GET /api/companies/:id/similar - Get similar companies
 * 
 * @module routes/companies
 * @requires express - Web framework
 * @requires authenticate - Authentication middleware (optional for public routes)
 * @requires CompanyController - Business logic controller
 * @requires rateLimiter - Rate limiting middleware
 * @requires express-validator - Input validation
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { CompanyController } from '../controllers/companyController';
import { generalLimiter } from '../middleware/rateLimiter';
import { param, query } from 'express-validator';

const router = Router();

/**
 * Query Validation for company listings
 */
const validateListingQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  query('projectType')
    .optional()
    .isAlphanumeric()
    .withMessage('Project type must be alphanumeric'),
  query('blockchainFocus')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Blockchain focus must not exceed 50 characters'),
  query('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),
  query('fundingStage')
    .optional()
    .isAlphanumeric()
    .withMessage('Funding stage must be alphanumeric'),
  query('teamSize')
    .optional()
    .isAlphanumeric()
    .withMessage('Team size must be alphanumeric'),
  query('isVerified')
    .optional()
    .isBoolean()
    .withMessage('IsVerified must be a boolean'),
  query('sortBy')
    .optional()
    .isIn(['trustScore', 'viewCount', 'createdAt', 'companyName'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

/**
 * Company ID Validation
 */
const validateCompanyId = [
  param('id')
    .isUUID()
    .withMessage('Company ID must be a valid UUID')
];

/**
 * Project Type Validation
 */
const validateProjectType = [
  param('type')
    .isLength({ min: 1, max: 50 })
    .withMessage('Project type must be between 1 and 50 characters')
];

/**
 * Search Query Validation
 */
const validateSearchQuery = [
  query('q')
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  query('projectTypes')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.every(type => typeof type === 'string' && type.length <= 50);
      }
      return typeof value === 'string' && value.length <= 50;
    })
    .withMessage('Invalid project types'),
  query('minTrustScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Min trust score must be between 0 and 100'),
  query('isVerified')
    .optional()
    .isBoolean()
    .withMessage('IsVerified must be a boolean'),
  query('hasPartnerships')
    .optional()
    .isBoolean()
    .withMessage('HasPartnerships must be a boolean'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];

/**
 * Optional Authentication Middleware
 * This middleware adds user info if authenticated, but doesn't require authentication
 */
const optionalAuthenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    authenticate(req, res, next);
  } else {
    next();
  }
};

/**
 * @route GET /api/companies
 * @desc Get all companies with filtering and pagination
 * @access Public
 * @middleware generalLimiter, validateListingQuery
 */
router.get(
  '/',
  generalLimiter,
  validateListingQuery,
  CompanyController.getCompanies
);

/**
 * @route GET /api/companies/featured
 * @desc Get featured companies (verified, high trust score)
 * @access Public
 * @middleware generalLimiter
 */
router.get(
  '/featured',
  generalLimiter,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
  CompanyController.getFeaturedCompanies
);

/**
 * @route GET /api/companies/trending
 * @desc Get trending companies based on recent activity
 * @access Public
 * @middleware generalLimiter
 */
router.get(
  '/trending',
  generalLimiter,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
  query('timeframe')
    .optional()
    .isIn(['7d', '30d', '90d'])
    .withMessage('Timeframe must be 7d, 30d, or 90d'),
  CompanyController.getTrendingCompanies
);

/**
 * @route GET /api/companies/search
 * @desc Advanced company search with filters
 * @access Public
 * @middleware generalLimiter, validateSearchQuery
 */
router.get(
  '/search',
  generalLimiter,
  validateSearchQuery,
  CompanyController.searchCompanies
);

/**
 * @route GET /api/companies/stats
 * @desc Get platform-wide company statistics
 * @access Public
 * @middleware generalLimiter
 */
router.get(
  '/stats',
  generalLimiter,
  CompanyController.getCompanyStatistics
);

/**
 * @route GET /api/companies/by-type/:type
 * @desc Get companies filtered by project type
 * @access Public
 * @middleware generalLimiter, validateProjectType
 */
router.get(
  '/by-type/:type',
  generalLimiter,
  validateProjectType,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('excludeCompanyId')
    .optional()
    .isUUID()
    .withMessage('Exclude company ID must be a valid UUID'),
  CompanyController.getCompaniesByType
);

/**
 * @route GET /api/companies/:id
 * @desc Get detailed company information by ID
 * @access Public (with optional authentication for view tracking)
 * @middleware generalLimiter, optionalAuthenticate, validateCompanyId
 */
router.get(
  '/:id',
  generalLimiter,
  optionalAuthenticate,
  validateCompanyId,
  CompanyController.getCompanyById
);

/**
 * @route GET /api/companies/:id/similar
 * @desc Get companies similar to the specified company
 * @access Public
 * @middleware generalLimiter, validateCompanyId
 */
router.get(
  '/:id/similar',
  generalLimiter,
  validateCompanyId,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Limit must be between 1 and 20'),
  CompanyController.getSimilarCompanies
);

export default router;