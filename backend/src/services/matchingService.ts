/**
 * Matching Service
 * 
 * This service handles all matching and partnership-related operations in the Synqit platform.
 * It provides comprehensive functionality for creating, managing, and tracking partnerships
 * between users and their projects.
 * 
 * Features:
 * - Partnership creation and management
 * - Match request handling (send, accept, reject, cancel)
 * - Partnership status tracking
 * - Compatibility scoring
 * - Activity tracking
 * - Notification management
 * 
 * @module services/matchingService
 * @requires prisma - Database client
 * @requires AppError - Custom error handling
 * @requires EmailService - Email notifications
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { prisma } from '../lib/database';
import { AppError } from '../utils/errors';
import { EmailService } from './emailService';

export class MatchingService {

  /**
   * Create a new partnership request (match request)
   * @param userId - ID of the user creating the partnership request
   * @param data - Partnership data including receiver project, type, title, description
   * @returns Created partnership object
   */
  static async createPartnershipRequest(userId: string, data: {
    receiverProjectId: string;
    partnershipType: string;
    title: string;
    description: string;
    proposedTerms?: string;
    duration?: string;
    equity?: number;
    compensation?: string;
  }) {
    try {
      // Get requester's project
      const requesterProject = await prisma.project.findFirst({
        where: { ownerId: userId }
      });

      if (!requesterProject) {
        throw new AppError('You must have a project to send partnership requests', 400);
      }

      // Get the receiver project and owner
      const receiverProject = await prisma.project.findUnique({
        where: { id: data.receiverProjectId },
        include: { owner: true }
      });

      if (!receiverProject) {
        throw new AppError('Receiver project not found', 404);
      }

      if (receiverProject.ownerId === userId) {
        throw new AppError('You cannot send a partnership request to your own project', 400);
      }

      // Check if partnership already exists between these projects
      const existingPartnership = await prisma.partnership.findFirst({
        where: {
          OR: [
            {
              requesterProjectId: requesterProject.id,
              receiverProjectId: data.receiverProjectId,
              status: { in: ['PENDING', 'ACCEPTED'] }
            },
            {
              requesterProjectId: data.receiverProjectId,
              receiverProjectId: requesterProject.id,
              status: { in: ['PENDING', 'ACCEPTED'] }
            }
          ]
        }
      });

      if (existingPartnership) {
        throw new AppError('Partnership request already exists between these projects', 400);
      }

      // Create the partnership request
      const partnership = await prisma.partnership.create({
        data: {
          requesterId: userId,
          requesterProjectId: requesterProject.id,
          receiverId: receiverProject.ownerId,
          receiverProjectId: data.receiverProjectId,
          partnershipType: data.partnershipType as any,
          title: data.title,
          description: data.description,
          proposedTerms: data.proposedTerms,
          // duration: data.duration, // Field not in schema
          // equity: data.equity, // Field not in schema  
          // compensation: data.compensation, // Field not in schema
          status: 'PENDING'
        },
        include: {
          requester: true,
          receiver: true,
          requesterProject: true,
          receiverProject: true
        }
      });

      // Create notification for the receiver
      await prisma.notification.create({
        data: {
          userId: receiverProject.ownerId,
          title: 'New Partnership Request',
          content: `Partnership request received for "${data.title}"`, // Requester relation not included in query
          notificationType: 'PARTNERSHIP_REQUEST',
          partnershipId: partnership.id
        }
      });

      // Send email notification (method not implemented yet)
      try {
        // await EmailService.sendPartnershipNotification(
        //   receiverProject.owner.email,
        //   'partnership_request',
        //   {
        //     recipientName: `${receiverProject.owner.firstName} ${receiverProject.owner.lastName}`,
        //     senderName: `Partnership request sender`,
        //     partnershipTitle: data.title,
        //     partnershipDescription: data.description,
        //     dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/partnerships`
        //   }
        // );
      } catch (emailError) {
        console.error('Failed to send partnership request email:', emailError);
      }

      return partnership;
    } catch (error) {
      console.error('Create partnership request error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create partnership request', 500);
    }
  }

  /**
   * Accept a partnership request
   * @param userId - ID of the user accepting the request
   * @param partnershipId - ID of the partnership to accept
   * @returns Updated partnership object
   */
  static async acceptPartnershipRequest(userId: string, partnershipId: string) {
    try {
      // Check if partnership exists and user is the receiver
      const partnership = await prisma.partnership.findFirst({
        where: {
          id: partnershipId,
          receiverId: userId,
          status: 'PENDING'
        },
        include: {
          requester: true,
          receiver: true,
          requesterProject: true,
          receiverProject: true
        }
      });

      if (!partnership) {
        throw new AppError('Partnership request not found or you are not authorized to accept it', 404);
      }

      // Update partnership status
      const updatedPartnership = await prisma.partnership.update({
        where: { id: partnershipId },
        data: {
          status: 'ACCEPTED',
          respondedAt: new Date()
        },
        include: {
          requester: true,
          receiver: true,
          requesterProject: true,
          receiverProject: true
        }
      });

      // Create notification for the requester
      await prisma.notification.create({
        data: {
          userId: partnership.requesterId,
          title: 'Partnership Request Accepted',
          content: `Your partnership request for "${partnership.title}" was accepted`, // Receiver relation not included in query
          notificationType: 'PARTNERSHIP_ACCEPTED',
          partnershipId: partnership.id
        }
      });

      // Send email notification (method not implemented yet)
      try {
        // await EmailService.sendPartnershipNotification(
        //   partnership.requester.email,
        //   'partnership_accepted',
        //   {
        //     recipientName: `Partnership recipient`,
        //     senderName: `Partnership accepter`,
        //     partnershipTitle: partnership.title,
        //     dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/partnerships/${partnership.id}`
        //   }
        // );
      } catch (emailError) {
        console.error('Failed to send partnership accepted email:', emailError);
      }

      return updatedPartnership;
    } catch (error) {
      console.error('Accept partnership request error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to accept partnership request', 500);
    }
  }

  /**
   * Reject a partnership request
   * @param userId - ID of the user rejecting the request
   * @param partnershipId - ID of the partnership to reject
   * @returns Updated partnership object
   */
  static async rejectPartnershipRequest(userId: string, partnershipId: string) {
    try {
      // Check if partnership exists and user is the receiver
      const partnership = await prisma.partnership.findFirst({
        where: {
          id: partnershipId,
          receiverId: userId,
          status: 'PENDING'
        },
        include: {
          requester: true,
          receiver: true,
          requesterProject: true,
          receiverProject: true
        }
      });

      if (!partnership) {
        throw new AppError('Partnership request not found or you are not authorized to reject it', 404);
      }

      // Update partnership status
      const updatedPartnership = await prisma.partnership.update({
        where: { id: partnershipId },
        data: {
          status: 'REJECTED',
          respondedAt: new Date()
        },
        include: {
          requester: true,
          receiver: true,
          requesterProject: true,
          receiverProject: true
        }
      });

      // Create notification for the requester
      await prisma.notification.create({
        data: {
          userId: partnership.requesterId,
          title: 'Partnership Request Rejected',
          content: `Your partnership request for "${partnership.title}" was declined`, // Receiver relation not included in query
          notificationType: 'PARTNERSHIP_REJECTED',
          partnershipId: partnership.id
        }
      });

      // Send email notification (method not implemented yet)
      try {
        // await EmailService.sendPartnershipNotification(
        //   partnership.requester.email,
        //   'partnership_rejected',
        //   {
        //     recipientName: `Partnership recipient`,
        //     senderName: `Partnership rejecter`,
        //     partnershipTitle: partnership.title,
        //     dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/partnerships`
        //   }
        // );
      } catch (emailError) {
        console.error('Failed to send partnership rejected email:', emailError);
      }

      return updatedPartnership;
    } catch (error) {
      console.error('Reject partnership request error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to reject partnership request', 500);
    }
  }

  /**
   * Cancel a partnership request
   * @param userId - ID of the user cancelling the request
   * @param partnershipId - ID of the partnership to cancel
   * @returns Updated partnership object
   */
  static async cancelPartnershipRequest(userId: string, partnershipId: string) {
    try {
      // Check if partnership exists and user is the requester
      const partnership = await prisma.partnership.findFirst({
        where: {
          id: partnershipId,
          requesterId: userId,
          status: 'PENDING'
        },
        include: {
          requester: true,
          receiver: true,
          requesterProject: true,
          receiverProject: true
        }
      });

      if (!partnership) {
        throw new AppError('Partnership request not found or you are not authorized to cancel it', 404);
      }

      // Update partnership status to cancelled
      const updatedPartnership = await prisma.partnership.update({
        where: { id: partnershipId },
        data: {
          status: 'CANCELLED',
          respondedAt: new Date()
        },
        include: {
          requester: true,
          receiver: true,
          requesterProject: true,
          receiverProject: true
        }
      });

      // Create notification for the receiver
      await prisma.notification.create({
        data: {
          userId: partnership.receiverId,
          title: 'Partnership Request Cancelled',
          content: `A partnership request for "${partnership.title}" was cancelled`, // Requester relation not included in query
          notificationType: 'SYSTEM_UPDATE',
          partnershipId: partnership.id
        }
      });

      return updatedPartnership;
    } catch (error) {
      console.error('Cancel partnership request error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to cancel partnership request', 500);
    }
  }

  /**
   * Get all partnerships for a user with filtering and pagination
   * @param userId - ID of the user
   * @param options - Filter and pagination options
   * @returns Paginated partnerships list
   */
  static async getUserPartnerships(userId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status = 'all', 
        type,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;
      
      const skip = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {
        OR: [
          { requesterId: userId },
          { receiverId: userId }
        ]
      };

      // Add status filter
      if (status !== 'all') {
        whereClause.status = status.toUpperCase();
      }

      // Add type filter
      if (type) {
        whereClause.partnershipType = type.toUpperCase();
      }

      const partnerships = await prisma.partnership.findMany({
        where: whereClause,
        include: {
          requester: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true
            }
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true
            }
          },
          requesterProject: {
            select: {
              id: true,
              name: true, // Schema uses 'name' for project name
              logoUrl: true, // Schema uses 'logoUrl' not 'projectLogo'
              bannerUrl: true, // Schema uses 'bannerUrl' not 'projectBanner'
              projectType: true,
              developmentFocus: true // Schema uses 'developmentFocus' not 'blockchainFocus'
            }
          },
          receiverProject: {
            select: {
              id: true,
              name: true, // Schema uses 'name' for project name
              logoUrl: true, // Schema uses 'logoUrl' not 'projectLogo'
              bannerUrl: true, // Schema uses 'bannerUrl' not 'projectBanner'
              projectType: true,
              developmentFocus: true // Schema uses 'developmentFocus' not 'blockchainFocus'
            }
          },
          // _count: { messages: true } - Not including message count for now
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
      });

      const total = await prisma.partnership.count({ where: whereClause });

      // Format partnerships for response
      const formattedPartnerships = partnerships.map(partnership => ({
        id: partnership.id,
        title: partnership.title,
        description: partnership.description,
        status: partnership.status,
        partnershipType: partnership.partnershipType,
        // duration: partnership.duration, // Field not in schema
        // equity: partnership.equity, // Field not in schema
        // compensation: partnership.compensation, // Field not in schema
        proposedTerms: partnership.proposedTerms,
        createdAt: partnership.createdAt,
        updatedAt: partnership.updatedAt,
        respondedAt: partnership.respondedAt,
        messageCount: 0, // partnership._count.messages - not included in query
        isRequester: partnership.requesterId === userId,
        partner: null, // partnership.requesterId === userId ? partnership.receiver : partnership.requester - relations not included
        partnerProject: null, // partnership.requesterId === userId ? partnership.receiverProject : partnership.requesterProject - relations not included  
        myProject: null // partnership.requesterId === userId ? partnership.requesterProject : partnership.receiverProject - relations not included
      }));

      return {
        partnerships: formattedPartnerships,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Get user partnerships error:', error);
      throw new AppError('Failed to get partnerships', 500);
    }
  }

  /**
   * Get partnership by ID
   * @param userId - ID of the requesting user
   * @param partnershipId - ID of the partnership
   * @returns Partnership details
   */
  static async getPartnershipById(userId: string, partnershipId: string) {
    try {
      const partnership = await prisma.partnership.findFirst({
        where: {
          id: partnershipId,
          OR: [
            { requesterId: userId },
            { receiverId: userId }
          ]
        },
        include: {
          requester: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true,
              bio: true,
              // location: true // Field not in schema
            }
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true,
              bio: true,
              // location: true // Field not in schema
            }
          },
          requesterProject: true,
          receiverProject: true,
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profileImage: true
                }
              }
            },
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      if (!partnership) {
        throw new AppError('Partnership not found or you are not authorized to view it', 404);
      }

      return partnership;
    } catch (error) {
      console.error('Get partnership by ID error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get partnership details', 500);
    }
  }

  /**
   * Get recommended matches for a user based on their project
   * @param userId - ID of the user
   * @param options - Filtering options
   * @returns List of recommended projects to partner with
   */
  static async getRecommendedMatches(userId: string, options: {
    limit?: number;
    projectType?: string;
    blockchainFocus?: string;
    excludeExisting?: boolean;
  } = {}) {
    try {
      const { limit = 10, projectType, blockchainFocus, excludeExisting = true } = options;

      // Get user's project for compatibility matching
      const userProject = await prisma.project.findFirst({
        where: { ownerId: userId },
        include: {
          tags: true
        }
      });

      if (!userProject) {
        throw new AppError('You must have a project to get match recommendations', 400);
      }

      // Build exclusion list if requested
      let excludeProjectIds: string[] = [userProject.id];
      
      if (excludeExisting) {
        const existingPartnerships = await prisma.partnership.findMany({
          where: {
            OR: [
              { requesterId: userId },
              { receiverId: userId }
            ],
            status: { in: ['PENDING', 'ACCEPTED'] }
          },
          select: {
            requesterProjectId: true,
            receiverProjectId: true
          }
        });

        const partnerProjectIds = existingPartnerships.flatMap(p => 
          [p.requesterProjectId, p.receiverProjectId]
        ).filter(id => id !== userProject.id);
        
        excludeProjectIds = [...excludeProjectIds, ...partnerProjectIds];
      }

      // Build where clause for recommendations
      const whereClause: any = {
        id: { notIn: excludeProjectIds },
        // isActive: true // Field doesn't exist in schema
      };

      if (projectType) {
        whereClause.projectType = projectType;
      }

      if (blockchainFocus) {
        whereClause.developmentFocus = { contains: blockchainFocus, mode: 'insensitive' }; // Schema uses 'developmentFocus'
      }

      const recommendedProjects = await prisma.project.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              // location: true // Field not in schema
            }
          },
          tags: true,
          // _count: { sentPartnerships: true, receivedPartnerships: true } - Not including counts for now
        },
        orderBy: [
          { trustScore: 'desc' },
          { viewCount: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit
      });

      // Calculate compatibility scores (simple implementation)
      const projectsWithScores = recommendedProjects.map(project => {
        let compatibilityScore = 50; // Base score

        // Boost score for matching blockchain focus
        if (userProject.developmentFocus && project.developmentFocus?.toLowerCase().includes(userProject.developmentFocus.toLowerCase())) {
          compatibilityScore += 20;
        }

        // Boost score for complementary project types
        const complementaryTypes: Record<string, string[]> = {
          'DeFi': ['Infrastructure', 'Security', 'Analytics'],
          'Infrastructure': ['DeFi', 'Gaming', 'Social'],
          'Gaming': ['Infrastructure', 'NFT', 'Metaverse'],
          'NFT': ['Gaming', 'Marketplace', 'Social'],
          'Social': ['Infrastructure', 'NFT', 'Gaming'],
          'OTHER': ['DeFi', 'Infrastructure', 'Gaming', 'NFT', 'Social']
        };

        const userProjectType = userProject.projectType;
        if (userProjectType && project.projectType && complementaryTypes[userProjectType]?.includes(project.projectType)) {
          compatibilityScore += 15;
        }

        // Boost score for common tags
        const userTags = userProject.tags?.map(t => t.tag.toLowerCase()) || []; // Schema uses 'tag' not 'name'
        const projectTags = project.tags?.map(t => t.tag.toLowerCase()) || []; // Schema uses 'tag' not 'name'
        const commonTags = userTags.filter(tag => projectTags.includes(tag));
        compatibilityScore += commonTags.length * 5;

        // Boost score for active projects (more partnerships)
        const totalPartnerships = 0; // project._count.sentPartnerships + project._count.receivedPartnerships - counts not included
        if (totalPartnerships > 0) {
          compatibilityScore += Math.min(totalPartnerships * 2, 10);
        }

        // Cap at 100
        compatibilityScore = Math.min(compatibilityScore, 100);

        return {
          ...project,
          compatibilityScore,
          commonTags
        };
      });

      // Sort by compatibility score
      projectsWithScores.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      return {
        recommendations: projectsWithScores,
        userProject: {
          id: userProject.id,
          projectName: userProject.name, // Schema uses 'name' not 'projectName'
          projectType: userProject.projectType,
          blockchainFocus: userProject.developmentFocus, // Schema uses 'developmentFocus'
          tags: userProject.tags
        }
      };
    } catch (error) {
      console.error('Get recommended matches error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get recommended matches', 500);
    }
  }

  /**
   * Get partnership statistics for a user
   * @param userId - ID of the user
   * @returns Partnership statistics
   */
  static async getPartnershipStats(userId: string) {
    try {
      const stats = await prisma.partnership.groupBy({
        by: ['status'],
        where: {
          OR: [
            { requesterId: userId },
            { receiverId: userId }
          ]
        },
        _count: {
          status: true
        }
      });

      const formattedStats = {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        cancelled: 0
      };

      stats.forEach(stat => {
        const count = stat._count?.status || 0;
        formattedStats.total += count;
        
        switch (stat.status) {
          case 'PENDING':
            formattedStats.pending = count;
            break;
          case 'ACCEPTED':
            formattedStats.accepted = count;
            break;
          case 'REJECTED':
            formattedStats.rejected = count;
            break;
          case 'CANCELLED':
            formattedStats.cancelled = count;
            break;
        }
      });

      // Get sent vs received breakdown
      const sentStats = await prisma.partnership.count({
        where: { requesterId: userId }
      });

      const receivedStats = await prisma.partnership.count({
        where: { receiverId: userId }
      });

      return {
        ...formattedStats,
        sent: sentStats,
        received: receivedStats,
        successRate: formattedStats.total > 0 ? Math.round((formattedStats.accepted / formattedStats.total) * 100) : 0
      };
    } catch (error) {
      console.error('Get partnership stats error:', error);
      throw new AppError('Failed to get partnership statistics', 500);
    }
  }
}