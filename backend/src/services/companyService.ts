/**
 * Company Service
 * 
 * This service handles company-specific operations in the Synqit platform.
 * It provides functionality for company discovery, filtering, statistics,
 * and advanced company management beyond basic profile operations.
 * 
 * Features:
 * - Company directory and search
 * - Company filtering by various criteria
 * - Company statistics and analytics
 * - Company verification status
 * - Company partnership history
 * - Company ranking and scoring
 * 
 * @module services/companyService
 * @requires prisma - Database client
 * @requires AppError - Custom error handling
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { prisma } from '../lib/database';
import { AppError } from '../utils/errors';

export class CompanyService {

  /**
   * Get all companies with filtering and pagination
   * @param options - Filtering and pagination options
   * @returns Paginated companies list
   */
  static async getCompanies(options: {
    page?: number;
    limit?: number;
    search?: string;
    projectType?: string;
    blockchainFocus?: string;
    location?: string;
    fundingStage?: string;
    teamSize?: string;
    isVerified?: boolean;
    sortBy?: 'trustScore' | 'viewCount' | 'createdAt' | 'name'; // Fixed: name not companyName
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    try {
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
      } = options;

      const skip = (page - 1) * limit;

      // Build where clause (no default filters)
      const whereClause: any = {};

      // Search filter
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } }, // Fixed: name not companyName/projectName
          { description: { contains: search, mode: 'insensitive' } }
          // { companyBio: { contains: search, mode: 'insensitive' } } // Field doesn't exist
        ];
      }

      // Project type filter
      if (projectType) {
        whereClause.projectType = projectType;
      }

      // Development focus filter (fixed field name)
      if (blockchainFocus) {
        whereClause.developmentFocus = { contains: blockchainFocus, mode: 'insensitive' };
      }

      // Location filter (using available location fields)
      if (location) {
        whereClause.OR = whereClause.OR || [];
        whereClause.OR.push(
          { country: { contains: location, mode: 'insensitive' } },
          { city: { contains: location, mode: 'insensitive' } }
        );
      }

      // Funding stage filter
      if (fundingStage) {
        whereClause.fundingStage = fundingStage;
      }

      // Team size filter
      if (teamSize) {
        whereClause.teamSize = teamSize;
      }

      // Verification filter (using verificationLevel)
      if (isVerified !== undefined) {
        whereClause.verificationLevel = isVerified ? 'VERIFIED' : 'BASIC'; // Fixed: BASIC not UNVERIFIED
      }

      // Get companies
      const companies = await prisma.project.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true,
              isVerified: true
            }
          },
          tags: {
            select: {
              id: true,
              tag: true
            }
          },
          _count: {
            select: {
              sentPartnerships: true,
              receivedPartnerships: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
      });

      const total = await prisma.project.count({ where: whereClause });

      // Format companies data
      const formattedCompanies = companies.map(company => ({
        id: company.id,
        companyName: company.name,
        projectName: company.name,
        description: company.description,
        companyBio: company.description,
        companyLogo: company.logoUrl,
        companyBanner: company.bannerUrl,
        projectLogo: company.logoUrl,
        projectBanner: company.bannerUrl,
        projectType: company.projectType,
        blockchainFocus: company.developmentFocus || '',
        companyLocation: '',
        fundingStage: company.fundingStage,
        teamSize: company.teamSize,
        trustScore: company.trustScore,
        viewCount: company.viewCount,
        isVerified: company.isVerified,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        owner: company.owner || null,
        tags: company.tags || [],
        partnershipCount: (company._count?.sentPartnerships || 0) + (company._count?.receivedPartnerships || 0),
        partnershipStats: {
          sent: company._count?.sentPartnerships || 0,
          received: company._count?.receivedPartnerships || 0,
          total: (company._count?.sentPartnerships || 0) + (company._count?.receivedPartnerships || 0)
        }
      }));

      return {
        companies: formattedCompanies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Get companies error:', error);
      throw new AppError('Failed to get companies', 500);
    }
  }

  /**
   * Get company details by ID
   * @param companyId - ID of the company/project
   * @param viewerId - Optional ID of the user viewing (for analytics)
   * @returns Detailed company information
   */
  static async getCompanyById(companyId: string, viewerId?: string) {
    try {
      const company = await prisma.project.findUnique({
        where: { id: companyId },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true,
              bio: true,
              isVerified: true,
              createdAt: true
            }
          },
          tags: {
            select: {
              id: true,
              tag: true
            }
          },
          sentPartnerships: {
            select: {
              id: true,
              status: true,
              partnershipType: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          receivedPartnerships: {
            select: {
              id: true,
              status: true,
              partnershipType: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          _count: {
            select: {
              sentPartnerships: true,
              receivedPartnerships: true
            }
          }
        }
      });

      if (!company) {
        throw new AppError('Company not found', 404);
      }

      // Increment view count if viewer is different from owner
      if (viewerId && viewerId !== company.ownerId) {
        await prisma.project.update({
          where: { id: companyId },
          data: { viewCount: { increment: 1 } }
        });
      }

      // Calculate partnership success rate
      // Note: sentPartnerships and receivedPartnerships relationships not included in current query
      const acceptedPartnerships = [] // Placeholder since relationships not loaded
      
      const totalPartnerships = (company._count?.sentPartnerships || 0) + (company._count?.receivedPartnerships || 0);
      const successRate = 0; // Placeholder - would need to query partnerships separately

      return {
        ...company,
        partnershipStats: {
          sent: company._count?.sentPartnerships || 0,
          received: company._count?.receivedPartnerships || 0,
          total: totalPartnerships,
          successRate
        },
        recentPartnerships: [] // Placeholder - partnerships not loaded in this query
      };
    } catch (error) {
      console.error('Get company by ID error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get company details', 500);
    }
  }

  /**
   * Get featured companies (verified, high trust score, active)
   * @param limit - Number of featured companies to return
   * @returns List of featured companies
   */
  static async getFeaturedCompanies(limit: number = 10) {
    try {
      const companies = await prisma.project.findMany({
        where: {
            isVerified: true,
          trustScore: { gte: 70 }
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          },
          tags: {
            select: {
              id: true,
              tag: true
            }
          },
          _count: {
            select: {
              sentPartnerships: { where: { status: 'ACCEPTED' } },
              receivedPartnerships: { where: { status: 'ACCEPTED' } }
            }
          }
        },
        orderBy: [
          { trustScore: 'desc' },
          { viewCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      });

      return companies.map(company => ({
        id: company.id,
        companyName: company.name,
        projectName: company.name,
        description: company.description,
        companyLogo: company.logoUrl,
        projectLogo: company.logoUrl,
        projectType: company.projectType,
        blockchainFocus: company.developmentFocus || '',
        trustScore: company.trustScore,
        viewCount: company.viewCount,
        owner: company.owner || null,
        tags: company.tags || [],
        successfulPartnerships: company._count.sentPartnerships + company._count.receivedPartnerships
      }));
    } catch (error) {
      console.error('Get featured companies error:', error);
      throw new AppError('Failed to get featured companies', 500);
    }
  }

  /**
   * Get companies by project type
   * @param projectType - Type of project to filter by
   * @param options - Additional filtering options
   * @returns Filtered companies list
   */
  static async getCompaniesByType(projectType: string, options: {
    limit?: number;
    excludeCompanyId?: string;
  } = {}) {
    try {
      const { limit = 20, excludeCompanyId } = options;

      const whereClause: any = {
        projectType,
        isActive: true
      };

      if (excludeCompanyId) {
        whereClause.id = { not: excludeCompanyId };
      }

      const companies = await prisma.project.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          },
          tags: true,
          _count: {
            select: {
              sentPartnerships: true,
              receivedPartnerships: true
            }
          }
        },
        orderBy: [
          { trustScore: 'desc' },
          { viewCount: 'desc' }
        ],
        take: limit
      });

      return companies.map(company => ({
        id: company.id,
        companyName: company.name,
        projectName: company.name,
        description: company.description,
        companyLogo: company.logoUrl,
        projectLogo: company.logoUrl,
        projectType: company.projectType,
        blockchainFocus: company.developmentFocus || '',
        trustScore: company.trustScore,
        owner: company.owner || null,
        tags: company.tags || [],
        partnershipCount: company._count.sentPartnerships + company._count.receivedPartnerships
      }));
    } catch (error) {
      console.error('Get companies by type error:', error);
      throw new AppError('Failed to get companies by type', 500);
    }
  }

  /**
   * Get company statistics aggregated across the platform
   * @returns Platform-wide company statistics
   */
  static async getCompanyStatistics() {
    try {
      // Get total companies
      const totalCompanies = await prisma.project.count({
        where: {}
      });

      // Get verified companies
      const verifiedCompanies = await prisma.project.count({
        where: { isVerified: true }
      });

      // Get companies by project type
      const companiesByType = await prisma.project.groupBy({
        by: ['projectType'],
        where: {},
        _count: { projectType: true }
      });

      // Get companies by funding stage
      const companiesByFunding = await prisma.project.groupBy({
        by: ['fundingStage'],
        where: { fundingStage: { not: null } },
        _count: { fundingStage: true }
      });

      // Get companies by team size
      const companiesByTeamSize = await prisma.project.groupBy({
        by: ['teamSize'],
        where: { teamSize: { not: null } },
        _count: { teamSize: true }
      });

      // Get average trust score
      const trustScoreStats = await prisma.project.aggregate({
        where: {},
        _avg: { trustScore: true },
        _min: { trustScore: true },
        _max: { trustScore: true }
      });

      // Get most popular blockchain focuses
      const blockchainFocuses = await prisma.project.findMany({
        where: { 
            developmentFocus: { not: null }
        },
        select: { developmentFocus: true }
      });

      const blockchainStats = blockchainFocuses.reduce((acc: any, item) => {
        const focus = item.developmentFocus;
        if (focus) {
          acc[focus] = (acc[focus] || 0) + 1;
        }
        return acc;
      }, {});

      return {
        totalCompanies,
        verifiedCompanies,
        verificationRate: Math.round((verifiedCompanies / totalCompanies) * 100),
        companiesByType: Object.fromEntries(
          companiesByType.map(item => [item.projectType, item._count?.projectType || 0])
        ),
        companiesByFunding: Object.fromEntries(
          companiesByFunding.map(item => [item.fundingStage, item._count?.fundingStage || 0])
        ),
        companiesByTeamSize: Object.fromEntries(
          companiesByTeamSize.map(item => [item.teamSize, item._count?.teamSize || 0])
        ),
        trustScoreStats: {
          average: Math.round(trustScoreStats._avg?.trustScore || 0),
          minimum: trustScoreStats._min?.trustScore || 0,
          maximum: trustScoreStats._max?.trustScore || 0
        },
        topBlockchainFocuses: Object.entries(blockchainStats)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([focus, count]) => ({ focus, count }))
      };
    } catch (error) {
      console.error('Get company statistics error:', error);
      throw new AppError('Failed to get company statistics', 500);
    }
  }

  /**
   * Search companies with advanced filters
   * @param searchTerm - Search term to match against company data
   * @param filters - Advanced search filters
   * @returns Matching companies
   */
  static async searchCompanies(searchTerm: string, filters: {
    projectTypes?: string[];
    blockchainFocuses?: string[];
    fundingStages?: string[];
    teamSizes?: string[];
    minTrustScore?: number;
    isVerified?: boolean;
    hasPartnerships?: boolean;
    location?: string;
    limit?: number;
    page?: number;
  } = {}) {
    try {
      const {
        projectTypes,
        blockchainFocuses,
        fundingStages,
        teamSizes,
        minTrustScore,
        isVerified,
        hasPartnerships,
        location,
        limit = 20,
        page = 1
      } = filters;

      const skip = (page - 1) * limit;

      // Build where clause (fixed field names)
      const whereClause: any = {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } }, // Fixed: name not companyName/projectName
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { developmentFocus: { contains: searchTerm, mode: 'insensitive' } } // Fixed: developmentFocus not blockchainFocus
          // { companyBio: { contains: searchTerm, mode: 'insensitive' } } // Field doesn't exist
        ]
        // Removed default isVerified filter to avoid errors
      };

      // Apply filters
      if (projectTypes && projectTypes.length > 0) {
        whereClause.projectType = { in: projectTypes };
      }

      if (blockchainFocuses && blockchainFocuses.length > 0) {
        whereClause.developmentFocus = { in: blockchainFocuses }; // Fixed: developmentFocus not blockchainFocus
      }

      if (fundingStages && fundingStages.length > 0) {
        whereClause.fundingStage = { in: fundingStages };
      }

      if (teamSizes && teamSizes.length > 0) {
        whereClause.teamSize = { in: teamSizes };
      }

      if (minTrustScore !== undefined) {
        whereClause.trustScore = { gte: minTrustScore };
      }

      if (isVerified !== undefined) {
        whereClause.verificationLevel = isVerified ? 'VERIFIED' : 'BASIC'; // Fixed: BASIC not UNVERIFIED
      }

      if (location) {
        // Use available location fields
        whereClause.OR = whereClause.OR || [];
        whereClause.OR.push(
          { country: { contains: location, mode: 'insensitive' } },
          { city: { contains: location, mode: 'insensitive' } }
        );
      }

      if (hasPartnerships) {
        whereClause.OR = [
          { sentPartnerships: { some: {} } },
          { receivedPartnerships: { some: {} } }
        ];
      }

      const companies = await prisma.project.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          },
          tags: true,
          _count: {
            select: {
              sentPartnerships: true,
              receivedPartnerships: true
            }
          }
        },
        orderBy: [
          { trustScore: 'desc' },
          { viewCount: 'desc' }
        ],
        skip,
        take: limit
      });

      const total = await prisma.project.count({ where: whereClause });

      return {
        companies: companies.map(company => ({
          id: company.id,
          companyName: company.name,
          projectName: company.name,
          description: company.description,
          companyLogo: company.logoUrl,
          projectType: company.projectType,
          blockchainFocus: company.developmentFocus || '',
          trustScore: company.trustScore,
          owner: company.owner || null,
          tags: company.tags || [],
          partnershipCount: company._count.sentPartnerships + company._count.receivedPartnerships
        })),
        searchTerm,
        filters,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Search companies error:', error);
      throw new AppError('Failed to search companies', 500);
    }
  }
}