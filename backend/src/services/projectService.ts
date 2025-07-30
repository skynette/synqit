import { Project, ProjectType, ProjectStage, TokenAvailability, TeamSize, FundingStage, Blockchain } from '@prisma/client';
import { prisma } from '../lib/database';

export interface CreateProjectData {
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  foundedYear?: number;
  projectType?: ProjectType;
  projectStage?: ProjectStage;
  teamSize?: TeamSize;
  fundingStage?: FundingStage;
  totalFunding?: number;
  isLookingForFunding?: boolean;
  isLookingForPartners?: boolean;
  tokenAvailability?: TokenAvailability;
  developmentFocus?: string;
  contactEmail?: string;
  twitterHandle?: string;
  discordServer?: string;
  telegramGroup?: string;
  redditCommunity?: string;
  githubUrl?: string;
  whitepaperUrl?: string;
  country?: string;
  city?: string;
  timezone?: string;
  blockchainPreferences?: Blockchain[];
  tags?: string[];
}

export interface ProjectFilters {
  search?: string;
  projectType?: ProjectType;
  projectStage?: ProjectStage;
  blockchain?: Blockchain;
  country?: string;
  isLookingForFunding?: boolean;
  isLookingForPartners?: boolean;
  tags?: string[];
  tokenAvailability?: TokenAvailability;
  fundingStage?: FundingStage;
  teamSize?: TeamSize;
  developmentFocus?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'viewCount' | 'trustScore';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Project Service
 * Handles project-related business logic
 */
export class ProjectService {
  /**
   * Get project by user ID
   */
  static async getProjectByUserId(userId: string): Promise<any> {
    return await prisma.project.findUnique({
      where: { ownerId: userId },
      include: {
        blockchainPreferences: true,
        tags: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            userType: true,
            subscriptionTier: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Get project by ID
   */
  static async getProjectById(projectId: string, incrementViewCount = false): Promise<any> {
    if (incrementViewCount) {
      await prisma.project.update({
        where: { id: projectId },
        data: { viewCount: { increment: 1 } },
      });
    }

    return await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        blockchainPreferences: true,
        tags: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            userType: true,
            subscriptionTier: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Create or update project
   */
  static async createOrUpdateProject(userId: string, data: CreateProjectData): Promise<any> {
    const {
      blockchainPreferences = [],
      tags = [],
      ...projectData
    } = data;

    return await prisma.$transaction(async (prisma) => {
      // Check if user already has a project
      const existingProject = await prisma.project.findUnique({
        where: { ownerId: userId },
        include: {
          blockchainPreferences: true,
          tags: true,
        },
      });

      let project;

      if (existingProject) {
        // Update existing project
        project = await prisma.project.update({
          where: { ownerId: userId },
          data: projectData,
        });

        // Update blockchain preferences
        if (blockchainPreferences.length > 0) {
          // Delete existing preferences
          await prisma.blockchainPreference.deleteMany({
            where: { projectId: project.id },
          });

          // Create new preferences
          await prisma.blockchainPreference.createMany({
            data: blockchainPreferences.map((blockchain, index) => ({
              projectId: project.id,
              blockchain,
              isPrimary: index === 0,
            })),
          });
        }

        // Update tags
        if (tags.length > 0) {
          // Delete existing tags
          await prisma.projectTag.deleteMany({
            where: { projectId: project.id },
          });

          // Create new tags
          await prisma.projectTag.createMany({
            data: tags.map(tag => ({
              projectId: project.id,
              tag: tag.toLowerCase(),
            })),
          });
        }
      } else {
        // Create new project
        project = await prisma.project.create({
          data: {
            ...projectData,
            ownerId: userId,
          },
        });

        // Create blockchain preferences
        if (blockchainPreferences.length > 0) {
          await prisma.blockchainPreference.createMany({
            data: blockchainPreferences.map((blockchain, index) => ({
              projectId: project.id,
              blockchain,
              isPrimary: index === 0,
            })),
          });
        }

        // Create tags
        if (tags.length > 0) {
          await prisma.projectTag.createMany({
            data: tags.map(tag => ({
              projectId: project.id,
              tag: tag.toLowerCase(),
            })),
          });
        }
      }

      // Return project with relations
      return await prisma.project.findUnique({
        where: { id: project.id },
        include: {
          blockchainPreferences: true,
          tags: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true,
              userType: true,
              subscriptionTier: true,
              isVerified: true,
              createdAt: true,
            },
          },
        },
      });
    });
  }

  /**
   * Get projects with filtering and pagination
   */
  static async getProjects(filters: ProjectFilters): Promise<{
    projects: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const {
      search,
      projectType,
      projectStage,
      blockchain,
      country,
      isLookingForFunding,
      isLookingForPartners,
      tags,
      tokenAvailability,
      fundingStage,
      teamSize,
      developmentFocus,
      page = 1,
      limit = 20,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { developmentFocus: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (projectType) where.projectType = projectType;
    if (projectStage) where.projectStage = projectStage;
    if (tokenAvailability) where.tokenAvailability = tokenAvailability;
    if (fundingStage) where.fundingStage = fundingStage;
    if (teamSize) where.teamSize = teamSize;
    if (country) where.country = { contains: country, mode: 'insensitive' };
    if (developmentFocus) where.developmentFocus = { contains: developmentFocus, mode: 'insensitive' };
    
    if (typeof isLookingForFunding === 'boolean') where.isLookingForFunding = isLookingForFunding;
    if (typeof isLookingForPartners === 'boolean') where.isLookingForPartners = isLookingForPartners;

    if (blockchain) {
      where.blockchainPreferences = {
        some: {
          blockchain,
        },
      };
    }

    if (tags && tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            in: tags.map(tag => tag.toLowerCase()),
          },
        },
      };
    }

    // Get total count
    const total = await prisma.project.count({ where });

    // Get projects
    const projects = await prisma.project.findMany({
      where,
      include: {
        blockchainPreferences: true,
        tags: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
            userType: true,
            subscriptionTier: true,
            isVerified: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            receivedPartnerships: true,
            sentPartnerships: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    });

    return {
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  /**
   * Delete project
   */
  static async deleteProject(userId: string): Promise<void> {
    const project = await prisma.project.findUnique({
      where: { ownerId: userId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    await prisma.$transaction(async (prisma) => {
      // Delete related records first
      await prisma.blockchainPreference.deleteMany({
        where: { projectId: project.id },
      });

      await prisma.projectTag.deleteMany({
        where: { projectId: project.id },
      });

      // Delete partnerships involving this project
      await prisma.partnership.deleteMany({
        where: {
          OR: [
            { requesterProjectId: project.id },
            { receiverProjectId: project.id },
          ],
        },
      });

      // Delete the project
      await prisma.project.delete({
        where: { id: project.id },
      });
    });
  }

  /**
   * Get project statistics
   */
  static async getProjectStats(projectId: string): Promise<{
    viewCount: number;
    partnershipRequestsReceived: number;
    partnershipRequestsSent: number;
    activePartnerships: number;
  }> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        _count: {
          select: {
            receivedPartnerships: true,
            sentPartnerships: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const activePartnerships = await prisma.partnership.count({
      where: {
        OR: [
          { requesterProjectId: projectId },
          { receiverProjectId: projectId },
        ],
        status: {
          in: ['ACCEPTED', 'IN_PROGRESS'],
        },
      },
    });

    return {
      viewCount: project.viewCount,
      partnershipRequestsReceived: project._count.receivedPartnerships,
      partnershipRequestsSent: project._count.sentPartnerships,
      activePartnerships,
    };
  }
}