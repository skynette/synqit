/**
 * Company Controller
 * 
 * This controller handles all company management endpoints for the Synqit platform.
 * It provides RESTful API endpoints for company discovery, filtering, statistics,
 * and advanced company operations beyond basic profile management.
 * 
 * Endpoints:
 * - GET /api/companies - Get all companies with filtering
 * - GET /api/companies/featured - Get featured companies
 * - GET /api/companies/search - Advanced company search
 * - GET /api/companies/stats - Get company statistics
 * - GET /api/companies/by-type/:type - Get companies by project type
 * - GET /api/companies/:id - Get company details
 * 
 * @module controllers/companyController
 * @requires CompanyService - Company business logic
 * @requires express-validator - Request validation
 * @requires AppError - Custom error handling
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../types/auth';
import { CompanyService } from '../services/companyService';
import { AppError } from '../utils/errors';

export class CompanyController {

  /**
   * Get all companies with filtering and pagination
   * @route GET /api/companies
   * @access Public
   * @query page - Page number (default: 1)
   * @query limit - Items per page (default: 20)
   * @query search - Search term
   * @query projectType - Filter by project type
   * @query blockchainFocus - Filter by blockchain focus
   * @query location - Filter by location
   * @query fundingStage - Filter by funding stage
   * @query teamSize - Filter by team size
   * @query isVerified - Filter by verification status
   * @query sortBy - Sort field
   * @query sortOrder - Sort order (asc/desc)
   * @returns Paginated companies list
   */
  static async getCompanies(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        page = 1,
        limit = 20,
        search,
        projectType,
        blockchainFocus,
        location,
        fundingStage,
        teamSize,
        isVerified,
        sortBy = 'trustScore',
        sortOrder = 'desc'
      } = req.query as any;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        projectType,
        blockchainFocus,
        location,
        fundingStage,
        teamSize,
        isVerified: isVerified === 'true',
        sortBy,
        sortOrder
      };

      const result = await CompanyService.getCompanies(options);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Companies retrieved successfully'
      });
    } catch (error) {
      console.error('Get companies error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get companies'
      });
    }
  }

  /**
   * Get company details by ID
   * @route GET /api/companies/:id
   * @access Public
   * @param req.params.id - Company ID
   * @returns Detailed company information
   */
  static async getCompanyById(req: AuthenticatedRequest, res: Response) {
    try {
      const companyId = req.params.id;
      const viewerId = req.user?.id; // Optional viewer ID for analytics

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID is required'
        });
      }

      const company = await CompanyService.getCompanyById(companyId, viewerId);

      res.status(200).json({
        success: true,
        data: company,
        message: 'Company details retrieved successfully'
      });
    } catch (error) {
      console.error('Get company by ID error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get company details'
      });
    }
  }

  /**
   * Get featured companies
   * @route GET /api/companies/featured
   * @access Public
   * @query limit - Number of featured companies (default: 10)
   * @returns List of featured companies
   */
  static async getFeaturedCompanies(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query as any;
      
      const companies = await CompanyService.getFeaturedCompanies(parseInt(limit));

      res.status(200).json({
        success: true,
        data: { companies },
        message: 'Featured companies retrieved successfully'
      });
    } catch (error) {
      console.error('Get featured companies error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get featured companies'
      });
    }
  }

  /**
   * Get companies by project type
   * @route GET /api/companies/by-type/:type
   * @access Public
   * @param req.params.type - Project type
   * @query limit - Number of companies to return
   * @query excludeCompanyId - Company ID to exclude from results
   * @returns Filtered companies list
   */
  static async getCompaniesByType(req: Request, res: Response) {
    try {
      const projectType = req.params.type;
      const { limit = 20, excludeCompanyId } = req.query as any;

      if (!projectType) {
        return res.status(400).json({
          success: false,
          message: 'Project type is required'
        });
      }

      const options = {
        limit: parseInt(limit),
        excludeCompanyId
      };

      const companies = await CompanyService.getCompaniesByType(projectType, options);

      res.status(200).json({
        success: true,
        data: { companies, projectType },
        message: 'Companies retrieved successfully'
      });
    } catch (error) {
      console.error('Get companies by type error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get companies by type'
      });
    }
  }

  /**
   * Get company statistics
   * @route GET /api/companies/stats
   * @access Public
   * @returns Platform-wide company statistics
   */
  static async getCompanyStatistics(req: Request, res: Response) {
    try {
      const stats = await CompanyService.getCompanyStatistics();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Company statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Get company statistics error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get company statistics'
      });
    }
  }

  /**
   * Advanced company search
   * @route GET /api/companies/search
   * @access Public
   * @query q - Search term (required)
   * @query projectTypes - Array of project types
   * @query blockchainFocuses - Array of blockchain focuses
   * @query fundingStages - Array of funding stages
   * @query teamSizes - Array of team sizes
   * @query minTrustScore - Minimum trust score
   * @query isVerified - Verification status filter
   * @query hasPartnerships - Filter companies with partnerships
   * @query location - Location filter
   * @query page - Page number
   * @query limit - Items per page
   * @returns Matching companies with search metadata
   */
  static async searchCompanies(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        q: searchTerm,
        projectTypes,
        blockchainFocuses,
        fundingStages,
        teamSizes,
        minTrustScore,
        isVerified,
        hasPartnerships,
        location,
        page = 1,
        limit = 20
      } = req.query as any;

      if (!searchTerm || searchTerm.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search term must be at least 2 characters long'
        });
      }

      const filters = {
        projectTypes: Array.isArray(projectTypes) ? projectTypes : (projectTypes ? [projectTypes] : undefined),
        blockchainFocuses: Array.isArray(blockchainFocuses) ? blockchainFocuses : (blockchainFocuses ? [blockchainFocuses] : undefined),
        fundingStages: Array.isArray(fundingStages) ? fundingStages : (fundingStages ? [fundingStages] : undefined),
        teamSizes: Array.isArray(teamSizes) ? teamSizes : (teamSizes ? [teamSizes] : undefined),
        minTrustScore: minTrustScore ? parseInt(minTrustScore) : undefined,
        isVerified: isVerified === 'true',
        hasPartnerships: hasPartnerships === 'true',
        location,
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await CompanyService.searchCompanies(searchTerm.trim(), filters);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Search completed successfully'
      });
    } catch (error) {
      console.error('Search companies error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to search companies'
      });
    }
  }

  /**
   * Get trending companies (high activity, recent partnerships)
   * @route GET /api/companies/trending
   * @access Public
   * @query limit - Number of trending companies
   * @query timeframe - Timeframe for trending analysis (7d, 30d, 90d)
   * @returns List of trending companies
   */
  static async getTrendingCompanies(req: Request, res: Response) {
    try {
      const { limit = 10, timeframe = '30d' } = req.query as any;
      
      // Calculate date based on timeframe
      const daysAgo = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : 30;
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - daysAgo);

      // This is a simplified trending algorithm
      // In a real implementation, you might want more sophisticated trending metrics
      const companies = await CompanyService.getCompanies({
        limit: parseInt(limit) * 2, // Get more to filter trending ones
        sortBy: 'viewCount',
        sortOrder: 'desc'
      });

      // Filter companies with recent activity
      const trendingCompanies = companies.companies
        .filter(company => new Date(company.updatedAt) > sinceDate)
        .slice(0, parseInt(limit));

      res.status(200).json({
        success: true,
        data: { 
          companies: trendingCompanies,
          timeframe,
          sinceDate 
        },
        message: 'Trending companies retrieved successfully'
      });
    } catch (error) {
      console.error('Get trending companies error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get trending companies'
      });
    }
  }

  /**
   * Get similar companies to a specific company
   * @route GET /api/companies/:id/similar
   * @access Public
   * @param req.params.id - Company ID
   * @query limit - Number of similar companies
   * @returns List of similar companies
   */
  static async getSimilarCompanies(req: Request, res: Response) {
    try {
      const companyId = req.params.id;
      const { limit = 10 } = req.query as any;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID is required'
        });
      }

      // Get the reference company
      const referenceCompany = await CompanyService.getCompanyById(companyId);
      
      if (!referenceCompany) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      // Get similar companies by project type first
      const similarByType = await CompanyService.getCompaniesByType(
        referenceCompany.projectType || 'Unknown', 
        { 
          limit: parseInt(limit),
          excludeCompanyId: companyId 
        }
      );

      res.status(200).json({
        success: true,
        data: { 
          companies: similarByType,
          referenceCompany: {
            id: referenceCompany.id,
            companyName: referenceCompany.name,
            projectType: referenceCompany.projectType
          }
        },
        message: 'Similar companies retrieved successfully'
      });
    } catch (error) {
      console.error('Get similar companies error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get similar companies'
      });
    }
  }
}