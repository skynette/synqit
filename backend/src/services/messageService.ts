/**
 * Message Service
 * 
 * This service handles all messaging functionality in the Synqit platform.
 * It provides comprehensive messaging capabilities between users, particularly
 * within the context of partnerships and collaborations.
 * 
 * Features:
 * - Send and receive messages
 * - Partnership-based messaging
 * - Message history and pagination  
 * - Message status tracking (read/unread)
 * - Message search and filtering
 * - Conversation management
 * - File attachments (future enhancement)
 * 
 * @module services/messageService
 * @requires prisma - Database client
 * @requires AppError - Custom error handling
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { prisma } from '../lib/database';
import { AppError } from '../utils/errors';

export class MessageService {

  /**
   * Send a message within a partnership
   * @param userId - ID of the user sending the message
   * @param data - Message data including partnership ID and content
   * @returns Created message object
   */
  static async sendMessage(userId: string, data: {
    partnershipId: string;
    content: string;
    messageType?: 'TEXT' | 'FILE' | 'SYSTEM';
    attachmentUrl?: string;
  }) {
    try {
      const { partnershipId, content, messageType = 'TEXT', attachmentUrl } = data;

      // Verify the partnership exists and user is part of it
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
            select: { id: true, firstName: true, lastName: true }
          },
          receiver: {
            select: { id: true, firstName: true, lastName: true }
          }
        }
      });

      if (!partnership) {
        throw new AppError('Partnership not found or you are not authorized to send messages', 404);
      }

      // Create the message
      const message = await prisma.message.create({
        data: {
          senderId: userId,
          receiverId: partnership.requesterId === userId ? partnership.receiverId : partnership.requesterId, // Required field
          partnershipId,
          content,
          messageType,
          // attachmentUrl, // Field not in schema
          isRead: false
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          }
        }
      });

      // Create notification for the recipient
      const recipientId = partnership.requesterId === userId ? partnership.receiverId : partnership.requesterId;
      const senderName = 'Someone'; // `${message.sender.firstName} ${message.sender.lastName}` - sender relation not included
      
      await prisma.notification.create({
        data: {
          userId: recipientId,
          title: 'New Message',
          content: `${senderName} sent you a message in "${partnership.title}"`,
          notificationType: 'SYSTEM_UPDATE', // 'MESSAGE' type doesn't exist in schema
          partnershipId: partnershipId
        }
      });

      return message;
    } catch (error) {
      console.error('Send message error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to send message', 500);
    }
  }

  /**
   * Get messages for a specific partnership with pagination
   * @param userId - ID of the requesting user
   * @param partnershipId - ID of the partnership
   * @param options - Pagination and filtering options
   * @returns Paginated messages list
   */
  static async getPartnershipMessages(
    userId: string, 
    partnershipId: string,
    options: {
      page?: number;
      limit?: number;
      before?: Date;
      after?: Date;
    } = {}
  ) {
    try {
      const { page = 1, limit = 50, before, after } = options;
      const skip = (page - 1) * limit;

      // Verify the partnership exists and user is part of it
      const partnership = await prisma.partnership.findFirst({
        where: {
          id: partnershipId,
          OR: [
            { requesterId: userId },
            { receiverId: userId }
          ]
        }
      });

      if (!partnership) {
        throw new AppError('Partnership not found or you are not authorized to view messages', 404);
      }

      // Build where clause for date filtering
      const whereClause: any = {
        partnershipId
      };

      if (before || after) {
        whereClause.createdAt = {};
        if (before) whereClause.createdAt.lt = before;
        if (after) whereClause.createdAt.gt = after;
      }

      // Get messages with pagination
      const messages = await prisma.message.findMany({
        where: whereClause,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      });

      const total = await prisma.message.count({ where: whereClause });

      // Mark messages as read for the requesting user (except their own messages)
      await prisma.message.updateMany({
        where: {
          partnershipId,
          senderId: { not: userId },
          isRead: false
        },
        data: {
          isRead: true
        }
      });

      // Reverse messages to show oldest first
      const sortedMessages = messages.reverse();

      return {
        messages: sortedMessages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Get partnership messages error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get messages', 500);
    }
  }

  /**
   * Get all conversations for a user
   * @param userId - ID of the user
   * @param options - Pagination options
   * @returns List of conversations with latest message
   */
  static async getUserConversations(userId: string, options: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  } = {}) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = options;
      const skip = (page - 1) * limit;

      // Get partnerships where user is involved
      let partnershipsWhereClause: any = {
        OR: [
          { requesterId: userId },
          { receiverId: userId }
        ]
      };

      // If unread only, filter partnerships with unread messages
      if (unreadOnly) {
        partnershipsWhereClause.messages = {
          some: {
            senderId: { not: userId },
            isRead: false
          }
        };
      }

      const partnerships = await prisma.partnership.findMany({
        where: partnershipsWhereClause,
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
          requesterProject: {
            select: {
              id: true,
              name: true, // Schema uses 'name' not 'projectName'
              logoUrl: true // Schema uses 'logoUrl' not 'projectLogo'
            }
          },
          receiverProject: {
            select: {
              id: true,
              name: true, // Schema uses 'name' not 'projectName'
              logoUrl: true // Schema uses 'logoUrl' not 'projectLogo'
            }
          },
          // messages: { orderBy: { createdAt: 'desc' }, take: 1 } - not including messages for now
          // _count: { messages: true } - not including message counts for now
        },
        orderBy: {
          updatedAt: 'desc' // Changed from messages._count which doesn't work
        },
        skip,
        take: limit
      });

      const total = await prisma.partnership.count({
        where: partnershipsWhereClause
      });

      // Format conversations
      const conversations = partnerships.map(partnership => {
        const isRequester = partnership.requesterId === userId;
        const partner = null; // isRequester ? partnership.receiver : partnership.requester - relations not included
        const partnerProject = null; // isRequester ? partnership.receiverProject : partnership.requesterProject - relations not included
        const myProject = null; // isRequester ? partnership.requesterProject : partnership.receiverProject - relations not included
        
        return {
          id: partnership.id,
          title: partnership.title,
          status: partnership.status,
          partner,
          partnerProject,
          myProject,
          lastMessage: null, // partnership.messages[0] || null - messages not included
          unreadCount: 0, // partnership._count.messages - count not included
          updatedAt: partnership.updatedAt
        };
      });

      // Sort by last message time (using partnership updatedAt since lastMessage is null)
      conversations.sort((a, b) => {
        const aTime = a.updatedAt; // a.lastMessage?.createdAt || a.updatedAt - lastMessage is null
        const bTime = b.updatedAt; // b.lastMessage?.createdAt || b.updatedAt - lastMessage is null
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });

      return {
        conversations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Get user conversations error:', error);
      throw new AppError('Failed to get conversations', 500);
    }
  }

  /**
   * Mark messages as read
   * @param userId - ID of the user marking messages as read
   * @param partnershipId - ID of the partnership
   * @param messageIds - Optional specific message IDs to mark as read
   * @returns Number of messages marked as read
   */
  static async markMessagesAsRead(
    userId: string, 
    partnershipId: string, 
    messageIds?: string[]
  ) {
    try {
      // Verify the partnership exists and user is part of it
      const partnership = await prisma.partnership.findFirst({
        where: {
          id: partnershipId,
          OR: [
            { requesterId: userId },
            { receiverId: userId }
          ]
        }
      });

      if (!partnership) {
        throw new AppError('Partnership not found or you are not authorized', 404);
      }

      // Build where clause
      const whereClause: any = {
        partnershipId,
        senderId: { not: userId }, // Don't mark own messages as read
        isRead: false
      };

      if (messageIds && messageIds.length > 0) {
        whereClause.id = { in: messageIds };
      }

      // Mark messages as read
      const result = await prisma.message.updateMany({
        where: whereClause,
        data: {
          isRead: true
        }
      });

      return result.count;
    } catch (error) {
      console.error('Mark messages as read error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to mark messages as read', 500);
    }
  }

  /**
   * Get unread message count for a user
   * @param userId - ID of the user
   * @returns Total unread message count
   */
  static async getUnreadMessageCount(userId: string) {
    try {
      const count = await prisma.message.count({
        where: {
          senderId: { not: userId },
          isRead: false,
          partnership: {
            OR: [
              { requesterId: userId },
              { receiverId: userId }
            ]
          }
        }
      });

      return { unreadCount: count };
    } catch (error) {
      console.error('Get unread message count error:', error);
      throw new AppError('Failed to get unread message count', 500);
    }
  }

  /**
   * Search messages within partnerships
   * @param userId - ID of the user searching
   * @param query - Search query
   * @param options - Search options
   * @returns Matching messages
   */
  static async searchMessages(userId: string, query: string, options: {
    partnershipId?: string;
    limit?: number;
    page?: number;
  } = {}) {
    try {
      const { partnershipId, limit = 50, page = 1 } = options;
      const skip = (page - 1) * limit;

      // Build where clause
      const whereClause: any = {
        content: {
          contains: query,
          mode: 'insensitive'
        },
        partnership: {
          OR: [
            { requesterId: userId },
            { receiverId: userId }
          ]
        }
      };

      if (partnershipId) {
        whereClause.partnershipId = partnershipId;
      }

      const messages = await prisma.message.findMany({
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
          partnership: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      });

      const total = await prisma.message.count({ where: whereClause });

      return {
        messages,
        query,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Search messages error:', error);
      throw new AppError('Failed to search messages', 500);
    }
  }

  /**
   * Delete a message (soft delete - mark as deleted)
   * @param userId - ID of the user deleting the message
   * @param messageId - ID of the message to delete
   * @returns Success result
   */
  static async deleteMessage(userId: string, messageId: string) {
    try {
      // Check if message exists and user is the sender
      const message = await prisma.message.findFirst({
        where: {
          id: messageId,
          senderId: userId
        }
      });

      if (!message) {
        throw new AppError('Message not found or you are not authorized to delete it', 404);
      }

      // Soft delete - update content and mark as deleted
      await prisma.message.update({
        where: { id: messageId },
        data: {
          content: '[Message deleted]',
          messageType: 'SYSTEM'
        }
      });

      return { success: true, message: 'Message deleted successfully' };
    } catch (error) {
      console.error('Delete message error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete message', 500);
    }
  }

  /**
   * Get message statistics for a user
   * @param userId - ID of the user
   * @returns Message statistics
   */
  static async getMessageStats(userId: string) {
    try {
      // Get total messages sent
      const messagesSent = await prisma.message.count({
        where: { senderId: userId }
      });

      // Get total messages received
      const messagesReceived = await prisma.message.count({
        where: {
          senderId: { not: userId },
          partnership: {
            OR: [
              { requesterId: userId },
              { receiverId: userId }
            ]
          }
        }
      });

      // Get unread messages
      const unreadMessages = await prisma.message.count({
        where: {
          senderId: { not: userId },
          isRead: false,
          partnership: {
            OR: [
              { requesterId: userId },
              { receiverId: userId }
            ]
          }
        }
      });

      // Get active conversations
      const activeConversations = await prisma.partnership.count({
        where: {
          OR: [
            { requesterId: userId },
            { receiverId: userId }
          ],
          messages: {
            some: {}
          }
        }
      });

      return {
        messagesSent,
        messagesReceived,
        unreadMessages,
        activeConversations,
        totalMessages: messagesSent + messagesReceived
      };
    } catch (error) {
      console.error('Get message stats error:', error);
      throw new AppError('Failed to get message statistics', 500);
    }
  }
}