import { prisma } from '../lib/database';
import { AppError } from '../utils/errors';

/**
 * Dashboard Service
 * Handles dashboard-related business logic
 */
export class DashboardService {
    /**
     * Get dashboard statistics for a user
     */
    static async getDashboardStats(userId: string) {
        try {
            // Get user's project
            const project = await prisma.project.findUnique({
                where: { ownerId: userId },
                include: {
                    _count: {
                        select: {
                            sentPartnerships: true,
                            receivedPartnerships: true,
                        }
                    }
                }
            });

            // Get partnership statistics
            const partnershipStats = await prisma.partnership.aggregate({
                where: {
                    OR: [
                        { requesterId: userId },
                        { receiverId: userId }
                    ]
                },
                _count: {
                    id: true
                }
            });

            // Get message statistics
            const messageStats = await prisma.message.aggregate({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                },
                _count: {
                    id: true
                }
            });

            return {
                projectStats: {
                    hasProject: !!project,
                    projectName: project?.name || '',
                    projectType: project?.projectType || '',
                    trustScore: project?.trustScore || 0,
                    viewCount: project?.viewCount || 0,
                    partnershipsSent: project?._count?.sentPartnerships || 0,
                    partnershipsReceived: project?._count?.receivedPartnerships || 0,
                },
                partnershipStats: {
                    total: partnershipStats._count.id,
                },
                messageStats: {
                    total: messageStats._count.id,
                }
            };
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw new AppError('Failed to get dashboard statistics', 500);
        }
    }

    /**
     * Get projects for exploration/dashboard
     */
    static async getProjects(userId: string, page: number = 1, limit: number = 20, filters: any = {}) {
        try {
            const skip = (page - 1) * limit;

            // Build where clause based on filters
            const where: any = {};
            
            if (filters.search) {
                where.OR = [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } }
                ];
            }

            if (filters.projectType) where.projectType = filters.projectType;
            if (filters.projectStage) where.projectStage = filters.projectStage;
            if (filters.teamSize) where.teamSize = filters.teamSize;
            if (filters.fundingStage) where.fundingStage = filters.fundingStage;

            const projects = await prisma.project.findMany({
                where,
                include: {
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
                        }
                    },
                    blockchainPreferences: true,
                    tags: true,
                    _count: {
                        select: {
                            sentPartnerships: true,
                            receivedPartnerships: true,
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            });

            const total = await prisma.project.count({ where });

            return {
                projects,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Get projects error:', error);
            throw new AppError('Failed to get projects', 500);
        }
    }

    /**
     * Get partnerships for a user
     */
    static async getPartnerships(userId: string, page: number = 1, limit: number = 20, status: string = 'all') {
        try {
            const skip = (page - 1) * limit;

            const whereClause: any = {
                OR: [
                    { requesterId: userId },
                    { receiverId: userId }
                ]
            };

            if (status !== 'all') {
                whereClause.status = status.toUpperCase();
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
                            profileImage: true,
                            userType: true,
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            profileImage: true,
                            userType: true,
                        }
                    },
                    requesterProject: {
                        select: {
                            id: true,
                            name: true,
                            projectType: true,
                            logoUrl: true,
                        }
                    },
                    receiverProject: {
                        select: {
                            id: true,
                            name: true,
                            projectType: true,
                            logoUrl: true,
                        }
                    },
                    _count: {
                        select: {
                            messages: true,
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            });

            const total = await prisma.partnership.count({ where: whereClause });

            const formattedPartnerships = partnerships.map(partnership => ({
                id: partnership.id,
                title: partnership.title,
                description: partnership.description,
                status: partnership.status,
                partnershipType: partnership.partnershipType,
                createdAt: partnership.createdAt,
                updatedAt: partnership.updatedAt,
                messageCount: partnership._count.messages,
                partner: partnership.requesterId === userId ? partnership.receiver : partnership.requester,
                partnerProject: partnership.requesterId === userId ? partnership.receiverProject : partnership.requesterProject
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
            console.error('Get partnerships error:', error);
            throw new AppError('Failed to get partnerships', 500);
        }
    }

    /**
     * Get recent activity for dashboard
     */
    static async getRecentActivity(userId: string, limit: number = 10) {
        try {
            // Get recent partnerships
            const recentPartnerships = await prisma.partnership.findMany({
                where: {
                    OR: [
                        { requesterId: userId },
                        { receiverId: userId }
                    ]
                },
                include: {
                    requester: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    },
                    receiver: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    }
                },
                take: limit,
                orderBy: { createdAt: 'desc' }
            });

            // Get recent messages
            const recentMessages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                },
                include: {
                    sender: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    },
                    receiver: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    }
                },
                take: limit,
                orderBy: { createdAt: 'desc' }
            });

            return {
                recentPartnerships,
                recentMessages
            };
        } catch (error) {
            console.error('Get recent activity error:', error);
            throw new AppError('Failed to get recent activity', 500);
        }
    }

    /**
     * Get project by ID
     */
    static async getProjectById(userId: string, projectId: string) {
        try {
            const project = await prisma.project.findUnique({
                where: { id: projectId },
                include: {
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
                        }
                    },
                    blockchainPreferences: {
                        select: {
                            blockchain: true,
                            isPrimary: true
                        }
                    },
                    tags: {
                        select: {
                            tag: true
                        }
                    },
                    _count: {
                        select: {
                            sentPartnerships: true,
                            receivedPartnerships: true,
                        }
                    }
                }
            });

            return project;
        } catch (error) {
            console.error('Get project by ID error:', error);
            throw new AppError('Failed to get project details', 500);
        }
    }

    /**
     * Get partnership by ID
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
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            profileImage: true,
                        }
                    },
                    requesterProject: {
                        select: {
                            id: true,
                            name: true,
                            projectType: true,
                            logoUrl: true,
                        }
                    },
                    receiverProject: {
                        select: {
                            id: true,
                            name: true,
                            projectType: true,
                            logoUrl: true,
                        }
                    }
                }
            });

            return partnership;
        } catch (error) {
            console.error('Get partnership by ID error:', error);
            throw new AppError('Failed to get partnership details', 500);
        }
    }

    /**
     * Get messages (placeholder)
     */
    static async getMessages(userId: string, page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;

            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            });

            const total = await prisma.message.count({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            });

            return {
                messages,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Get messages error:', error);
            throw new AppError('Failed to get messages', 500);
        }
    }

    /**
     * Get notifications (placeholder)
     */
    static async getNotifications(userId: string, page: number = 1, limit: number = 20) {
        try {
            const skip = (page - 1) * limit;

            const notifications = await prisma.notification.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            });

            const total = await prisma.notification.count({
                where: { userId }
            });

            return {
                notifications,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Get notifications error:', error);
            throw new AppError('Failed to get notifications', 500);
        }
    }

    /**
     * Get profile (placeholder)
     */
    static async getProfile(userId: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    bio: true,
                    userType: true,
                    subscriptionTier: true,
                    isVerified: true,
                    createdAt: true,
                    project: {
                        include: {
                            blockchainPreferences: true,
                            tags: true,
                        }
                    }
                }
            });

            return user;
        } catch (error) {
            console.error('Get profile error:', error);
            throw new AppError('Failed to get profile', 500);
        }
    }
}