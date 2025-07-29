import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

export class DashboardService {
    static async getUserStats(userId: string) {
        try {
            const [
                totalPartnerships,
                pendingRequests,
                acceptedPartnerships,
                unreadMessages,
                totalConnections,
                userProject
            ] = await Promise.all([
                prisma.partnership.count({
                    where: {
                        OR: [
                            { requesterId: userId },
                            { receiverId: userId }
                        ]
                    }
                }),
                prisma.partnership.count({
                    where: {
                        receiverId: userId,
                        status: 'PENDING'
                    }
                }),
                prisma.partnership.count({
                    where: {
                        OR: [
                            { requesterId: userId },
                            { receiverId: userId }
                        ],
                        status: 'ACCEPTED'
                    }
                }),
                prisma.message.count({
                    where: {
                        receiverId: userId,
                        isRead: false
                    }
                }),
                prisma.partnership.count({
                    where: {
                        OR: [
                            { requesterId: userId },
                            { receiverId: userId }
                        ],
                        status: 'ACCEPTED'
                    }
                }),
                prisma.project.findUnique({
                    where: { ownerId: userId },
                    select: {
                        id: true,
                        name: true,
                        isVerified: true,
                        trustScore: true
                    }
                })
            ]);

            return {
                totalPartnerships,
                pendingRequests,
                acceptedPartnerships,
                unreadMessages,
                totalConnections,
                project: userProject,
                completionRate: userProject ? 85 : 20 // Basic completion rate logic
            };
        } catch (error) {
            console.error('Get user stats error:', error);
            throw new AppError('Failed to get user stats', 500);
        }
    }

    static async getProjects(userId: string, page: number = 1, limit: number = 50, filters: any = {}) {
        try {
            const skip = (page - 1) * limit;

            // Build where clause based on filters
            const whereClause: any = {
                ownerId: { not: userId }, // Exclude user's own project
                // Remove isVerified requirement for now
            };

            if (filters.search) {
                whereClause.OR = [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } },
                    { developmentFocus: { contains: filters.search, mode: 'insensitive' } }
                ];
            }

            if (filters.projectType && filters.projectType !== 'N/A') {
                whereClause.projectType = filters.projectType;
            }

            if (filters.projectStage && filters.projectStage !== 'N/A') {
                whereClause.projectStage = filters.projectStage;
            }

            if (filters.teamSize && filters.teamSize !== 'N/A') {
                whereClause.teamSize = filters.teamSize;
            }

            if (filters.fundingStage && filters.fundingStage !== 'N/A') {
                whereClause.fundingStage = filters.fundingStage;
            }

            if (filters.blockchain && filters.blockchain !== 'N/A') {
                whereClause.blockchainPreferences = {
                    some: {
                        blockchain: filters.blockchain
                    }
                };
            }

            // Apply tab-based filtering
            if (filters.tab === 'trending') {
                // Sort by view count and trust score
                whereClause.viewCount = { gte: 10 };
            } else if (filters.tab === 'recent-partnership') {
                // Projects with recent partnership activity
                whereClause.OR = [
                    {
                        sentPartnerships: {
                            some: {
                                createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                            }
                        }
                    },
                    {
                        receivedPartnerships: {
                            some: {
                                createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                            }
                        }
                    }
                ];
            } else if (filters.tab === 'socials') {
                // Projects with social media presence
                whereClause.OR = [
                    { twitterHandle: { not: null } },
                    { discordServer: { not: null } },
                    { telegramGroup: { not: null } }
                ];
            } else if (filters.tab === 'new-projects') {
                // Projects created in the last 90 days
                whereClause.createdAt = { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
            } else if (filters.tab === 'ai-projects') {
                // AI focused projects
                whereClause.OR = [
                    { projectType: 'AI' },
                    { description: { contains: 'AI', mode: 'insensitive' } },
                    { description: { contains: 'artificial intelligence', mode: 'insensitive' } },
                    { description: { contains: 'machine learning', mode: 'insensitive' } }
                ];
            } else if (filters.tab === 'defi-projects') {
                // DeFi projects
                whereClause.OR = [
                    { projectType: 'DEFI' },
                    { description: { contains: 'DeFi', mode: 'insensitive' } },
                    { description: { contains: 'decentralized finance', mode: 'insensitive' } }
                ];
            } else if (filters.tab === 'web3-projects') {
                // Web3 focused projects
                whereClause.OR = [
                    { description: { contains: 'Web3', mode: 'insensitive' } },
                    { description: { contains: 'blockchain', mode: 'insensitive' } },
                    { description: { contains: 'crypto', mode: 'insensitive' } },
                    { blockchainPreferences: { some: {} } }
                ];
            } else if (filters.tab === 'gamefi-projects') {
                // GameFi projects
                whereClause.OR = [
                    { projectType: 'GAMEFI' },
                    { description: { contains: 'game', mode: 'insensitive' } },
                    { description: { contains: 'gaming', mode: 'insensitive' } }
                ];
            } else if (filters.tab === 'vcs') {
                // Projects looking for funding
                whereClause.OR = [
                    { owner: { userType: 'INVESTOR' } },
                    { isLookingForFunding: true },
                    { fundingStage: { not: null } }
                ];
            } else if (filters.tab === 'builders') {
                // Active builders
                whereClause.OR = [
                    { owner: { userType: 'STARTUP' } },
                    { owner: { userType: 'ECOSYSTEM_PLAYER' } },
                    { isLookingForPartners: true },
                    { projectStage: { in: ['MVP', 'BETA_TESTING', 'LIVE', 'SCALING'] } }
                ];
            }

            const [projects, total] = await Promise.all([
                prisma.project.findMany({
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
                                receivedPartnerships: true
                            }
                        }
                    },
                    skip,
                    take: limit,
                    orderBy: [
                        { trustScore: 'desc' },
                        { viewCount: 'desc' },
                        { createdAt: 'desc' }
                    ]
                }),
                prisma.project.count({ where: whereClause })
            ]);

            // Transform data to match frontend expectations
            const transformedProjects = projects.map(project => ({
                id: project.id,
                name: project.name,
                logo: project.logoUrl || '/images/default-project.png',
                projectLogo: project.logoUrl || '/icons/default-project.png',
                bannerUrl: project.bannerUrl,
                description: project.description,
                projectType: project.projectType,
                projectStage: project.projectStage,
                developmentFocus: project.developmentFocus,
                requestType: 'Partnership',
                partnerAvatars: [
                    project.owner.profileImage || '/avatars/default-avatar.png'
                ],
                tags: [
                    project.projectType,
                    project.projectStage,
                    project.teamSize,
                    project.fundingStage,
                    ...project.tags.map(t => t.tag),
                    ...project.blockchainPreferences.map(bp => bp.blockchain)
                ].filter(Boolean),
                owner: project.owner,
                trustScore: project.trustScore,
                isVerified: project.isVerified,
                viewCount: project.viewCount,
                partnershipCount: project._count.sentPartnerships + project._count.receivedPartnerships,
                teamSize: project.teamSize,
                fundingStage: project.fundingStage,
                tokenAvailability: project.tokenAvailability,
                website: project.website,
                githubUrl: project.githubUrl,
                whitepaperUrl: project.whitepaperUrl,
                foundedYear: project.foundedYear,
                totalFunding: project.totalFunding,
                isLookingForFunding: project.isLookingForFunding,
                isLookingForPartners: project.isLookingForPartners,
                contactEmail: project.contactEmail,
                twitterHandle: project.twitterHandle,
                discordServer: project.discordServer,
                telegramGroup: project.telegramGroup,
                country: project.country,
                city: project.city,
                timezone: project.timezone,
                blockchainPreferences: project.blockchainPreferences,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            }));

            return {
                projects: transformedProjects,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error('Get projects error:', error);
            throw new AppError('Failed to get projects', 500);
        }
    }

    static async getCompanyById(userId: string, companyId: string) {
        try {
            const company = await prisma.company.findUnique({
                where: { id: companyId },
                include: {
                    owner: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true,
                            createdAt: true
                        }
                    },
                    blockchainPreferences: {
                        select: {
                            blockchain: true,
                            isPrimary: true
                        }
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
                return null;
            }

            // Check if user has existing partnership with this company
            const existingPartnership = await prisma.partnership.findFirst({
                where: {
                    OR: [
                        { requesterId: userId, receiverCompanyId: companyId },
                        { receiverId: userId, requesterCompanyId: companyId }
                    ]
                }
            });

            return {
                ...company,
                partnershipCount: company._count.sentPartnerships + company._count.receivedPartnerships,
                hasExistingPartnership: !!existingPartnership,
                existingPartnershipStatus: existingPartnership?.status || null
            };
        } catch (error) {
            console.error('Get company by ID error:', error);
            throw new AppError('Failed to get company details', 500);
        }
    }

    static async getPartnerships(userId: string, page: number = 1, limit: number = 20, status: string = 'all', type: string = 'all') {
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

            if (type !== 'all') {
                whereClause.partnershipType = type.toUpperCase();
            }

            const [partnerships, total] = await Promise.all([
                prisma.partnership.findMany({
                    where: whereClause,
                    include: {
                        requester: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        },
                        receiver: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        },
                        requesterCompany: {
                            select: {
                                id: true,
                                name: true,
                                logoUrl: true
                            }
                        },
                        receiverCompany: {
                            select: {
                                id: true,
                                name: true,
                                logoUrl: true
                            }
                        },
                        _count: {
                            select: {
                                messages: true
                            }
                        }
                    },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.partnership.count({ where: whereClause })
            ]);

            const transformedPartnerships = partnerships.map(partnership => ({
                ...partnership,
                isRequester: partnership.requesterId === userId,
                messageCount: partnership._count.messages,
                partner: partnership.requesterId === userId ? partnership.receiver : partnership.requester,
                partnerCompany: partnership.requesterId === userId ? partnership.receiverCompany : partnership.requesterCompany
            }));

            return {
                partnerships: transformedPartnerships,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error('Get partnerships error:', error);
            throw new AppError('Failed to get partnerships', 500);
        }
    }

    static async getPartnershipById(userId: string, partnershipId: string) {
        try {
            const partnership = await prisma.partnership.findUnique({
                where: { id: partnershipId },
                include: {
                    requester: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true
                        }
                    },
                    receiver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true
                        }
                    },
                    requesterCompany: {
                        select: {
                            id: true,
                            name: true,
                            logoUrl: true,
                            description: true
                        }
                    },
                    receiverCompany: {
                        select: {
                            id: true,
                            name: true,
                            logoUrl: true,
                            description: true
                        }
                    },
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
                return null;
            }

            // Check if user is part of this partnership
            const isAuthorized = partnership.requesterId === userId || partnership.receiverId === userId;

            if (!isAuthorized) {
                throw new AppError('Not authorized to view this partnership', 403);
            }

            return {
                ...partnership,
                isRequester: partnership.requesterId === userId,
                partner: partnership.requesterId === userId ? partnership.receiver : partnership.requester,
                partnerCompany: partnership.requesterId === userId ? partnership.receiverCompany : partnership.requesterCompany
            };
        } catch (error) {
            console.error('Get partnership by ID error:', error);
            throw new AppError('Failed to get partnership details', 500);
        }
    }

    static async getMessages(userId: string, page: number = 1, limit: number = 20, conversationId?: string) {
        try {
            const skip = (page - 1) * limit;

            const whereClause: any = {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            };

            if (conversationId) {
                whereClause.partnershipId = conversationId;
            }

            const [messages, total] = await Promise.all([
                prisma.message.findMany({
                    where: whereClause,
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        },
                        receiver: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        },
                        partnership: {
                            select: {
                                id: true,
                                title: true,
                                requesterCompany: {
                                    select: {
                                        name: true,
                                        logoUrl: true
                                    }
                                },
                                receiverCompany: {
                                    select: {
                                        name: true,
                                        logoUrl: true
                                    }
                                }
                            }
                        }
                    },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.message.count({ where: whereClause })
            ]);

            // Mark messages as read if they are received by the current user
            const unreadMessageIds = messages
                .filter(msg => msg.receiverId === userId && !msg.isRead)
                .map(msg => msg.id);

            if (unreadMessageIds.length > 0) {
                await prisma.message.updateMany({
                    where: { id: { in: unreadMessageIds } },
                    data: { isRead: true, readAt: new Date() }
                });
            }

            return {
                messages,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error('Get messages error:', error);
            throw new AppError('Failed to get messages', 500);
        }
    }

    static async getNotifications(userId: string, page: number = 1, limit: number = 20, unreadOnly: boolean = false) {
        try {
            const skip = (page - 1) * limit;

            const whereClause: any = {
                userId,
                isDeleted: false
            };

            if (unreadOnly) {
                whereClause.isRead = false;
            }

            const [notifications, total] = await Promise.all([
                prisma.notification.findMany({
                    where: whereClause,
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.notification.count({ where: whereClause })
            ]);

            return {
                notifications,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error('Get notifications error:', error);
            throw new AppError('Failed to get notifications', 500);
        }
    }

    static async getProfile(userId: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    company: {
                        include: {
                            blockchainPreferences: {
                                select: {
                                    blockchain: true,
                                    isPrimary: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            sentPartnershipRequests: true,
                            receivedPartnershipRequests: true,
                            sentMessages: true,
                            receivedMessages: true
                        }
                    }
                }
            });

            if (!user) {
                throw new AppError('User not found', 404);
            }

            return {
                ...user,
                totalPartnerships: user._count.sentPartnershipRequests + user._count.receivedPartnershipRequests,
                totalMessages: user._count.sentMessages + user._count.receivedMessages
            };
        } catch (error) {
            console.error('Get profile error:', error);
            throw new AppError('Failed to get profile', 500);
        }
    }
}