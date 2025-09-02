/**
 * Matching Routes
 * 
 * This module defines all routes for matching and partnership functionality.
 * It handles partnership requests, acceptances, rejections, cancellations,
 * and recommendation systems for the Synqit platform.
 * 
 * Routes:
 * - POST /api/matches/request - Create partnership request
 * - GET /api/matches - Get all user partnerships
 * - GET /api/matches/sent - Get sent partnerships
 * - GET /api/matches/received - Get received partnerships
 * - GET /api/matches/recommendations - Get recommended matches
 * - GET /api/matches/stats - Get partnership statistics
 * - GET /api/matches/:id - Get partnership details
 * - POST /api/matches/:id/accept - Accept partnership request
 * - POST /api/matches/:id/reject - Reject partnership request
 * - POST /api/matches/:id/cancel - Cancel partnership request
 * 
 * @module routes/matches
 * @requires express - Web framework
 * @requires authenticate - Authentication middleware
 * @requires MatchingController - Business logic controller
 * @requires rateLimiter - Rate limiting middleware
 * @requires matchingValidation - Input validation middleware
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { MatchingController } from '../controllers/matchingController';
import { generalLimiter } from '../middleware/rateLimiter';
import { body, param, query } from 'express-validator';
import { validateCuid } from '../utils/validation';

const router = Router();

// All matching routes require authentication
router.use(authenticate);

/**
 * Partnership Request Validation
 */
const validatePartnershipRequest = [
  body('receiverProjectId')
    .custom(validateCuid)
    .withMessage('Receiver project ID must be a valid cuid'),
  body('partnershipType')
    .isIn(['TECHNICAL', 'BUSINESS', 'MARKETING', 'ADVISORY', 'INVESTMENT', 'COLLABORATION'])
    .withMessage('Invalid partnership type'),
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('proposedTerms')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Proposed terms must not exceed 1000 characters'),
  body('duration')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Duration must not exceed 50 characters'),
  body('equity')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Equity must be between 0 and 100'),
  body('compensation')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Compensation must not exceed 200 characters')
];

/**
 * Partnership ID Validation
 */
const validatePartnershipId = [
  param('id')
    .custom(validateCuid)
    .withMessage('Partnership ID must be a valid cuid')
];

/**
 * Query Validation for listings
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
  query('status')
    .optional()
    .isIn(['all', 'pending', 'accepted', 'rejected', 'cancelled'])
    .withMessage('Invalid status filter'),
  query('type')
    .optional()
    .isIn(['TECHNICAL', 'BUSINESS', 'MARKETING', 'ADVISORY', 'INVESTMENT', 'COLLABORATION'])
    .withMessage('Invalid type filter'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Invalid sort order')
];

/**
 * Recommendations Query Validation
 */
const validateRecommendationsQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('projectType')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Project type must not exceed 50 characters'),
  query('blockchainFocus')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Blockchain focus must not exceed 50 characters'),
  query('excludeExisting')
    .optional()
    .isBoolean()
    .withMessage('ExcludeExisting must be a boolean')
];

/**
 * @route POST /api/matches/request
 * @desc Create a new partnership request
 * @access Private
 * @middleware generalLimiter, authenticate, validatePartnershipRequest
 */
router.post(
  '/request',
  generalLimiter,
  validatePartnershipRequest,
  MatchingController.createPartnershipRequest
);

/**
 * @route GET /api/matches
 * @desc Get all user partnerships with filtering and pagination
 * @access Private
 * @middleware generalLimiter, authenticate, validateListingQuery
 */
router.get(
  '/',
  generalLimiter,
  validateListingQuery,
  MatchingController.getUserPartnerships
);

/**
 * @route GET /api/matches/sent
 * @desc Get sent partnership requests
 * @access Private
 * @middleware generalLimiter, authenticate, validateListingQuery
 */
router.get(
  '/sent',
  generalLimiter,
  validateListingQuery,
  MatchingController.getSentPartnerships
);

/**
 * @route GET /api/matches/received
 * @desc Get received partnership requests
 * @access Private
 * @middleware generalLimiter, authenticate, validateListingQuery
 */
router.get(
  '/received',
  generalLimiter,
  validateListingQuery,
  MatchingController.getReceivedPartnerships
);

/**
 * @route GET /api/matches/recommendations
 * @desc Get recommended matches based on user's project
 * @access Private
 * @middleware generalLimiter, authenticate, validateRecommendationsQuery
 */
router.get(
  '/recommendations',
  generalLimiter,
  validateRecommendationsQuery,
  MatchingController.getRecommendedMatches
);

/**
 * @route GET /api/matches/stats
 * @desc Get partnership statistics for the user
 * @access Private
 * @middleware generalLimiter, authenticate
 */
router.get(
  '/stats',
  generalLimiter,
  MatchingController.getPartnershipStats
);

/**
 * @route GET /api/matches/:id
 * @desc Get partnership details by ID
 * @access Private
 * @middleware generalLimiter, authenticate, validatePartnershipId
 */
router.get(
  '/:id',
  generalLimiter,
  validatePartnershipId,
  MatchingController.getPartnershipDetails
);

/**
 * @route POST /api/matches/:id/accept
 * @desc Accept a partnership request
 * @access Private
 * @middleware generalLimiter, authenticate, validatePartnershipId
 */
router.post(
  '/:id/accept',
  generalLimiter,
  validatePartnershipId,
  MatchingController.acceptPartnershipRequest
);

/**
 * @route POST /api/matches/:id/reject
 * @desc Reject a partnership request
 * @access Private
 * @middleware generalLimiter, authenticate, validatePartnershipId
 */
router.post(
  '/:id/reject',
  generalLimiter,
  validatePartnershipId,
  MatchingController.rejectPartnershipRequest
);

/**
 * @route POST /api/matches/:id/cancel
 * @desc Cancel a partnership request
 * @access Private
 * @middleware generalLimiter, authenticate, validatePartnershipId
 */
router.post(
  '/:id/cancel',
  generalLimiter,
  validatePartnershipId,
  MatchingController.cancelPartnershipRequest
);

export default router;