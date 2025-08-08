/**
 * Matching Controller
 * 
 * This controller handles all matching and partnership endpoints for the Synqit platform.
 * It provides RESTful API endpoints for managing partnerships, match requests,
 * and compatibility-based recommendations.
 * 
 * Endpoints:
 * - POST /api/matches/request - Create a new partnership request
 * - POST /api/matches/:id/accept - Accept a partnership request
 * - POST /api/matches/:id/reject - Reject a partnership request
 * - POST /api/matches/:id/cancel - Cancel a partnership request
 * - GET /api/matches - Get user's partnerships with filtering
 * - GET /api/matches/:id - Get partnership details
 * - GET /api/matches/recommendations - Get recommended matches
 * - GET /api/matches/stats - Get partnership statistics
 * 
 * @module controllers/matchingController
 * @requires MatchingService - Partnership business logic
 * @requires express-validator - Request validation
 * @requires AppError - Custom error handling
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../types/auth';
import { MatchingService } from '../services/matchingService';
import { AppError } from '../utils/errors';

export class MatchingController {

  /**
   * Create a new partnership request
   * @route POST /api/matches/request
   * @access Private
   * @param req.body - Partnership request data
   * @returns Created partnership object
   */
  static async createPartnershipRequest(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user!.id;
      const partnershipData = req.body;

      const partnership = await MatchingService.createPartnershipRequest(userId, partnershipData);

      res.status(201).json({
        success: true,
        data: partnership,
        message: 'Partnership request sent successfully'
      });
    } catch (error) {
      console.error('Create partnership request error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to send partnership request'
      });
    }
  }

  /**
   * Accept a partnership request
   * @route POST /api/matches/:id/accept
   * @access Private
   * @param req.params.id - Partnership ID
   * @returns Updated partnership object
   */
  static async acceptPartnershipRequest(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const partnershipId = req.params.id;

      if (!partnershipId) {
        return res.status(400).json({
          success: false,
          message: 'Partnership ID is required'
        });
      }

      const partnership = await MatchingService.acceptPartnershipRequest(userId, partnershipId);

      res.status(200).json({
        success: true,
        data: partnership,
        message: 'Partnership request accepted successfully'
      });
    } catch (error) {
      console.error('Accept partnership request error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to accept partnership request'
      });
    }
  }

  /**
   * Reject a partnership request
   * @route POST /api/matches/:id/reject
   * @access Private
   * @param req.params.id - Partnership ID
   * @returns Updated partnership object
   */
  static async rejectPartnershipRequest(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const partnershipId = req.params.id;

      if (!partnershipId) {
        return res.status(400).json({
          success: false,
          message: 'Partnership ID is required'
        });
      }

      const partnership = await MatchingService.rejectPartnershipRequest(userId, partnershipId);

      res.status(200).json({
        success: true,
        data: partnership,
        message: 'Partnership request rejected successfully'
      });
    } catch (error) {
      console.error('Reject partnership request error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to reject partnership request'
      });
    }
  }

  /**
   * Cancel a partnership request
   * @route POST /api/matches/:id/cancel
   * @access Private
   * @param req.params.id - Partnership ID
   * @returns Updated partnership object
   */
  static async cancelPartnershipRequest(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const partnershipId = req.params.id;

      if (!partnershipId) {
        return res.status(400).json({
          success: false,
          message: 'Partnership ID is required'
        });
      }

      const partnership = await MatchingService.cancelPartnershipRequest(userId, partnershipId);

      res.status(200).json({
        success: true,
        data: partnership,
        message: 'Partnership request cancelled successfully'
      });
    } catch (error) {
      console.error('Cancel partnership request error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to cancel partnership request'
      });
    }
  }

  /**
   * Get user's partnerships with filtering and pagination
   * @route GET /api/matches
   * @access Private
   * @query page - Page number (default: 1)
   * @query limit - Items per page (default: 20)
   * @query status - Filter by status (all, pending, accepted, rejected, cancelled)
   * @query type - Filter by partnership type
   * @query sortBy - Sort field (createdAt, updatedAt, title)
   * @query sortOrder - Sort order (asc, desc)
   * @returns Paginated partnerships list
   */
  static async getUserPartnerships(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const {
        page = 1,
        limit = 20,
        status = 'all',
        type,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query as any;

      // Validate sortBy field
      const validSortFields = ['createdAt', 'updatedAt', 'title'];
      const sortByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        type,
        sortBy: sortByField as 'createdAt' | 'updatedAt' | 'title',
        sortOrder: sortOrder as 'asc' | 'desc'
      };

      const result = await MatchingService.getUserPartnerships(userId, options);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Partnerships retrieved successfully'
      });
    } catch (error) {
      console.error('Get user partnerships error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get partnerships'
      });
    }
  }

  /**
   * Get partnership details by ID
   * @route GET /api/matches/:id
   * @access Private
   * @param req.params.id - Partnership ID
   * @returns Partnership details with messages
   */
  static async getPartnershipDetails(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const partnershipId = req.params.id;

      if (!partnershipId) {
        return res.status(400).json({
          success: false,
          message: 'Partnership ID is required'
        });
      }

      const partnership = await MatchingService.getPartnershipById(userId, partnershipId);

      res.status(200).json({
        success: true,
        data: partnership,
        message: 'Partnership details retrieved successfully'
      });
    } catch (error) {
      console.error('Get partnership details error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get partnership details'
      });
    }
  }

  /**
   * Get recommended matches for the user
   * @route GET /api/matches/recommendations
   * @access Private
   * @query limit - Number of recommendations (default: 10)
   * @query projectType - Filter by project type
   * @query blockchainFocus - Filter by blockchain focus
   * @query excludeExisting - Exclude existing partnerships (default: true)
   * @returns List of recommended projects with compatibility scores
   */
  static async getRecommendedMatches(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const {
        limit = 10,
        projectType,
        blockchainFocus,
        excludeExisting = 'true'
      } = req.query as any;

      const options = {
        limit: parseInt(limit),
        projectType,
        blockchainFocus,
        excludeExisting: excludeExisting === 'true'
      };

      const recommendations = await MatchingService.getRecommendedMatches(userId, options);

      res.status(200).json({
        success: true,
        data: recommendations,
        message: 'Match recommendations retrieved successfully'
      });
    } catch (error) {
      console.error('Get recommended matches error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get match recommendations'
      });
    }
  }

  /**
   * Get partnership statistics for the user
   * @route GET /api/matches/stats
   * @access Private
   * @returns Partnership statistics including success rate
   */
  static async getPartnershipStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const stats = await MatchingService.getPartnershipStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Partnership statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Get partnership stats error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get partnership statistics'
      });
    }
  }

  /**
   * Get sent partnership requests
   * @route GET /api/matches/sent
   * @access Private
   * @query page - Page number (default: 1)
   * @query limit - Items per page (default: 20)
   * @query status - Filter by status
   * @returns Paginated sent partnerships list
   */
  static async getSentPartnerships(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const {
        page = 1,
        limit = 20,
        status = 'all'
      } = req.query as any;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const
      };

      // Get only sent partnerships by filtering after
      const result = await MatchingService.getUserPartnerships(userId, options);
      
      // Filter to only show sent partnerships
      const sentPartnerships = result.partnerships.filter(p => p.isRequester);
      
      res.status(200).json({
        success: true,
        data: {
          partnerships: sentPartnerships,
          pagination: {
            ...result.pagination,
            total: sentPartnerships.length,
            totalPages: Math.ceil(sentPartnerships.length / options.limit)
          }
        },
        message: 'Sent partnerships retrieved successfully'
      });
    } catch (error) {
      console.error('Get sent partnerships error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get sent partnerships'
      });
    }
  }

  /**
   * Get received partnership requests
   * @route GET /api/matches/received
   * @access Private
   * @query page - Page number (default: 1)
   * @query limit - Items per page (default: 20)
   * @query status - Filter by status
   * @returns Paginated received partnerships list
   */
  static async getReceivedPartnerships(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const {
        page = 1,
        limit = 20,
        status = 'all'
      } = req.query as any;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const
      };

      // Get only received partnerships by filtering after
      const result = await MatchingService.getUserPartnerships(userId, options);
      
      // Filter to only show received partnerships
      const receivedPartnerships = result.partnerships.filter(p => !p.isRequester);
      
      res.status(200).json({
        success: true,
        data: {
          partnerships: receivedPartnerships,
          pagination: {
            ...result.pagination,
            total: receivedPartnerships.length,
            totalPages: Math.ceil(receivedPartnerships.length / options.limit)
          }
        },
        message: 'Received partnerships retrieved successfully'
      });
    } catch (error) {
      console.error('Get received partnerships error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get received partnerships'
      });
    }
  }
}