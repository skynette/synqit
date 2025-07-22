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
                userCompany
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
                prisma.company.findUnique({
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
                company: userCompany,
                completionRate: userCompany ? 85 : 20 // Basic completion rate logic
            };
        } catch (error) {
            console.error('Get user stats error:', error);
            throw new AppError('Failed to get user stats', 500);
        }
    }

    static async getCompanies(userId: string, page: number = 1, limit: number = 50, filters: any = {}) {
        try {
            const skip = (page - 1) * limit;

            // Build where clause based on filters
            const whereClause: any = {
                ownerId: { not: userId }, // Exclude user's own company
                isVerified: true // Only show verified companies
            };

            if (filters.search) {
                whereClause.OR = [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } }
                ];
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
                // Sort by trust score and recent activity
                whereClause.trustScore = { gte: 50 };
            } else if (filters.tab === 'recent-partnership') {
                // Companies with recent partnership activity
                whereClause.OR = [
                    {
                        sentPartnerships: {
                            some: {
                                createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
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
                // Companies with social media presence
                whereClause.OR = [
                    { twitterHandle: { not: null } },
                    { discordServer: { not: null } },
                    { telegramGroup: { not: null } }
                ];
            } else if (filters.tab === 'new-projects') {
                // Companies created in the last 90 days
                whereClause.createdAt = { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
            } else if (filters.tab === 'rwa-projects') {
                // Real World Asset projects - companies with specific keywords or focus
                whereClause.OR = [
                    { description: { contains: 'RWA', mode: 'insensitive' } },
                    { description: { contains: 'Real World Asset', mode: 'insensitive' } },
                    { description: { contains: 'tokenization', mode: 'insensitive' } },
                    { description: { contains: 'real estate', mode: 'insensitive' } },
                    { description: { contains: 'commodities', mode: 'insensitive' } },
                    { name: { contains: 'RWA', mode: 'insensitive' } }
                ];
            } else if (filters.tab === 'web3-projects') {
                // Web3 focused projects
                whereClause.OR = [
                    { description: { contains: 'Web3', mode: 'insensitive' } },
                    { description: { contains: 'blockchain', mode: 'insensitive' } },
                    { description: { contains: 'crypto', mode: 'insensitive' } },
                    { description: { contains: 'DeFi', mode: 'insensitive' } },
                    { description: { contains: 'NFT', mode: 'insensitive' } },
                    { description: { contains: 'DAO', mode: 'insensitive' } },
                    { blockchainPreferences: { some: {} } } // Has blockchain preferences
                ];
            } else if (filters.tab === 'vcs') {
                // Venture Capital companies or companies looking for funding
                whereClause.OR = [
                    { owner: { userType: 'INVESTOR' } },
                    { isLookingForFunding: true },
                    { fundingStage: { not: null } },
                    { description: { contains: 'invest', mode: 'insensitive' } },
                    { description: { contains: 'venture', mode: 'insensitive' } },
                    { description: { contains: 'fund', mode: 'insensitive' } }
                ];
            } else if (filters.tab === 'builders') {
                // Companies/developers actively building
                whereClause.OR = [
                    { owner: { userType: 'STARTUP' } },
                    { owner: { userType: 'ECOSYSTEM_PLAYER' } },
                    { description: { contains: 'build', mode: 'insensitive' } },
                    { description: { contains: 'develop', mode: 'insensitive' } },
                    { description: { contains: 'create', mode: 'insensitive' } },
                    { isLookingForPartners: true }
                ];
            }

            const [companies, total] = await Promise.all([
                prisma.company.findMany({
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
                        { createdAt: 'desc' }
                    ]
                }),
                prisma.company.count({ where: whereClause })
            ]);

            // Transform data to match frontend expectations
            const transformedCompanies = companies.map(company => ({
                id: company.id,
                name: company.name,
                logo: company.logoUrl || '/images/default-company.png',
                companyLogo: company.logoUrl || '/icons/default-company.png',
                description: company.description,
                requestType: 'Partnership',
                partnerAvatars: [
                    company.owner.profileImage || '/avatars/default-avatar.png'
                ],
                tags: [
                    company.teamSize || 'Team',
                    company.fundingStage || 'Funded',
                    ...(company.blockchainPreferences.map(bp => bp.blockchain) || [])
                ].filter(Boolean),
                owner: company.owner,
                trustScore: company.trustScore,
                isVerified: company.isVerified,
                partnershipCount: company._count.sentPartnerships + company._count.receivedPartnerships,
                teamSize: company.teamSize,
                fundingStage: company.fundingStage,
                website: company.website,
                foundedYear: company.foundedYear,
                totalFunding: company.totalFunding,
                isLookingForFunding: company.isLookingForFunding,
                isLookingForPartners: company.isLookingForPartners,
                contactEmail: company.contactEmail,
                twitterHandle: company.twitterHandle,
                discordServer: company.discordServer,
                telegramGroup: company.telegramGroup,
                country: company.country,
                city: company.city,
                blockchainPreferences: company.blockchainPreferences,
                createdAt: company.createdAt,
                updatedAt: company.updatedAt
            }));

            return {
                companies: transformedCompanies,
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
            console.error('Get companies error:', error);
            throw new AppError('Failed to get companies', 500);
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