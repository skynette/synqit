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
     * Create a new partnership request
     */
    static async createPartnership(userId: string, data: {
        receiverProjectId: string;
        partnershipType: string;
        title: string;
        description: string;
        proposedTerms?: string;
    }) {
        try {
            // Get the requester's project
            const requesterProject = await prisma.project.findUnique({
                where: { ownerId: userId },
                select: { id: true }
            });

            if (!requesterProject) {
                throw new AppError('You must have a project to create partnerships', 400);
            }

            // Get the receiver project and owner
            const receiverProject = await prisma.project.findUnique({
                where: { id: data.receiverProjectId },
                select: { id: true, ownerId: true }
            });

            if (!receiverProject) {
                throw new AppError('Receiver project not found', 404);
            }

            if (receiverProject.ownerId === userId) {
                throw new AppError('You cannot create a partnership with your own project', 400);
            }

            // Check if partnership already exists
            const existingPartnership = await prisma.partnership.findFirst({
                where: {
                    OR: [
                        {
                            requesterId: userId,
                            receiverId: receiverProject.ownerId,
                            requesterProjectId: requesterProject.id,
                            receiverProjectId: data.receiverProjectId
                        },
                        {
                            requesterId: receiverProject.ownerId,
                            receiverId: userId,
                            requesterProjectId: data.receiverProjectId,
                            receiverProjectId: requesterProject.id
                        }
                    ]
                }
            });

            if (existingPartnership) {
                throw new AppError('Partnership request already exists between these projects', 400);
            }

            // Create the partnership
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
                    status: 'PENDING'
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

            // Create notification for the receiver
            await prisma.notification.create({
                data: {
                    userId: receiverProject.ownerId,
                    title: 'New Partnership Request',
                    content: `${partnership.requester.firstName} ${partnership.requester.lastName} sent you a partnership request for "${data.title}"`,
                    notificationType: 'PARTNERSHIP_REQUEST',
                    partnershipId: partnership.id
                }
            });

            return partnership;
        } catch (error) {
            console.error('Create partnership error:', error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to create partnership', 500);
        }
    }

    /**
     * Accept a partnership request
     */
    static async acceptPartnership(userId: string, partnershipId: string) {
        try {
            // Check if partnership exists and user is the receiver
            const partnership = await prisma.partnership.findFirst({
                where: {
                    id: partnershipId,
                    receiverId: userId,
                    status: 'PENDING'
                },
                include: {
                    requester: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        }
                    }
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

            // Create notification for the requester
            await prisma.notification.create({
                data: {
                    userId: partnership.requesterId,
                    title: 'Partnership Request Accepted',
                    content: `${partnership.receiver.firstName} ${partnership.receiver.lastName} accepted your partnership request for "${partnership.title}"`,
                    notificationType: 'PARTNERSHIP_ACCEPTED',
                    partnershipId: partnership.id
                }
            });

            return updatedPartnership;
        } catch (error) {
            console.error('Accept partnership error:', error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to accept partnership', 500);
        }
    }

    /**
     * Reject a partnership request
     */
    static async rejectPartnership(userId: string, partnershipId: string) {
        try {
            // Check if partnership exists and user is the receiver
            const partnership = await prisma.partnership.findFirst({
                where: {
                    id: partnershipId,
                    receiverId: userId,
                    status: 'PENDING'
                },
                include: {
                    requester: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        }
                    }
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

            // Create notification for the requester
            await prisma.notification.create({
                data: {
                    userId: partnership.requesterId,
                    title: 'Partnership Request Rejected',
                    content: `${partnership.receiver.firstName} ${partnership.receiver.lastName} declined your partnership request for "${partnership.title}"`,
                    notificationType: 'PARTNERSHIP_REJECTED',
                    partnershipId: partnership.id
                }
            });

            return updatedPartnership;
        } catch (error) {
            console.error('Reject partnership error:', error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to reject partnership', 500);
        }
    }

    /**
     * Cancel a partnership request
     */
    static async cancelPartnership(userId: string, partnershipId: string) {
        try {
            // Check if partnership exists and user is the requester
            const partnership = await prisma.partnership.findFirst({
                where: {
                    id: partnershipId,
                    requesterId: userId,
                    status: 'PENDING'
                },
                include: {
                    requester: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        }
                    }
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

            // Create notification for the receiver
            await prisma.notification.create({
                data: {
                    userId: partnership.receiverId,
                    title: 'Partnership Request Cancelled',
                    content: `${partnership.requester.firstName} ${partnership.requester.lastName} cancelled their partnership request for "${partnership.title}"`,
                    notificationType: 'SYSTEM_UPDATE',
                    partnershipId: partnership.id
                }
            });

            return updatedPartnership;
        } catch (error) {
            console.error('Cancel partnership error:', error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to cancel partnership', 500);
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