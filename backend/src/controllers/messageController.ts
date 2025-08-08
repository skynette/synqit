/**
 * Message Controller
 * 
 * This controller handles all messaging endpoints for the Synqit platform.
 * It provides RESTful API endpoints for sending messages, retrieving conversations,
 * managing message states, and searching through message history.
 * 
 * Endpoints:
 * - POST /api/messages/send - Send a message
 * - GET /api/messages/conversations - Get all user conversations  
 * - GET /api/messages/partnerships/:id - Get messages for a partnership
 * - GET /api/messages/unread-count - Get unread message count
 * - POST /api/messages/mark-read - Mark messages as read
 * - GET /api/messages/search - Search messages
 * - DELETE /api/messages/:id - Delete a message
 * - GET /api/messages/stats - Get message statistics
 * 
 * @module controllers/messageController
 * @requires MessageService - Message business logic
 * @requires express-validator - Request validation
 * @requires AppError - Custom error handling
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../types/auth';
import { MessageService } from '../services/messageService';
import { AppError } from '../utils/errors';

export class MessageController {

  /**
   * Send a message within a partnership
   * @route POST /api/messages/send
   * @access Private
   * @param req.body - Message data including partnership ID and content
   * @returns Created message object
   */
  static async sendMessage(req: AuthenticatedRequest, res: Response) {
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
      const messageData = req.body;

      const message = await MessageService.sendMessage(userId, messageData);

      res.status(201).json({
        success: true,
        data: message,
        message: 'Message sent successfully'
      });
    } catch (error) {
      console.error('Send message error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to send message'
      });
    }
  }

  /**
   * Get all conversations for the user
   * @route GET /api/messages/conversations
   * @access Private
   * @query page - Page number (default: 1)
   * @query limit - Items per page (default: 20)
   * @query unreadOnly - Show only conversations with unread messages
   * @returns List of conversations with latest message
   */
  static async getUserConversations(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const {
        page = 1,
        limit = 20,
        unreadOnly = 'false'
      } = req.query as any;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        unreadOnly: unreadOnly === 'true'
      };

      const result = await MessageService.getUserConversations(userId, options);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Conversations retrieved successfully'
      });
    } catch (error) {
      console.error('Get user conversations error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get conversations'
      });
    }
  }

  /**
   * Get messages for a specific partnership
   * @route GET /api/messages/partnerships/:id
   * @access Private
   * @param req.params.id - Partnership ID
   * @query page - Page number (default: 1)
   * @query limit - Items per page (default: 50)
   * @query before - Get messages before this date
   * @query after - Get messages after this date
   * @returns Paginated messages list
   */
  static async getPartnershipMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const partnershipId = req.params.id;
      const {
        page = 1,
        limit = 50,
        before,
        after
      } = req.query as any;

      if (!partnershipId) {
        return res.status(400).json({
          success: false,
          message: 'Partnership ID is required'
        });
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        before: before ? new Date(before) : undefined,
        after: after ? new Date(after) : undefined
      };

      const result = await MessageService.getPartnershipMessages(userId, partnershipId, options);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Messages retrieved successfully'
      });
    } catch (error) {
      console.error('Get partnership messages error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get messages'
      });
    }
  }

  /**
   * Mark messages as read
   * @route POST /api/messages/mark-read
   * @access Private
   * @param req.body.partnershipId - Partnership ID
   * @param req.body.messageIds - Optional specific message IDs
   * @returns Number of messages marked as read
   */
  static async markMessagesAsRead(req: AuthenticatedRequest, res: Response) {
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
      const { partnershipId, messageIds } = req.body;

      const count = await MessageService.markMessagesAsRead(userId, partnershipId, messageIds);

      res.status(200).json({
        success: true,
        data: { markedCount: count },
        message: `${count} messages marked as read`
      });
    } catch (error) {
      console.error('Mark messages as read error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to mark messages as read'
      });
    }
  }

  /**
   * Get unread message count for the user
   * @route GET /api/messages/unread-count
   * @access Private
   * @returns Total unread message count
   */
  static async getUnreadMessageCount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const result = await MessageService.getUnreadMessageCount(userId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Unread count retrieved successfully'
      });
    } catch (error) {
      console.error('Get unread message count error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get unread message count'
      });
    }
  }

  /**
   * Search messages
   * @route GET /api/messages/search
   * @access Private
   * @query q - Search query
   * @query partnershipId - Optional partnership filter
   * @query page - Page number (default: 1)
   * @query limit - Items per page (default: 50)
   * @returns Matching messages
   */
  static async searchMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const {
        q: query,
        partnershipId,
        page = 1,
        limit = 50
      } = req.query as any;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters long'
        });
      }

      const options = {
        partnershipId,
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await MessageService.searchMessages(userId, query.trim(), options);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Search completed successfully'
      });
    } catch (error) {
      console.error('Search messages error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to search messages'
      });
    }
  }

  /**
   * Delete a message
   * @route DELETE /api/messages/:id
   * @access Private
   * @param req.params.id - Message ID
   * @returns Success result
   */
  static async deleteMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const messageId = req.params.id;

      if (!messageId) {
        return res.status(400).json({
          success: false,
          message: 'Message ID is required'
        });
      }

      const result = await MessageService.deleteMessage(userId, messageId);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Delete message error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete message'
      });
    }
  }

  /**
   * Get message statistics for the user
   * @route GET /api/messages/stats
   * @access Private
   * @returns Message statistics including sent, received, unread counts
   */
  static async getMessageStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const stats = await MessageService.getMessageStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Message statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Get message stats error:', error);
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get message statistics'
      });
    }
  }

  /**
   * Get recent messages across all partnerships
   * @route GET /api/messages/recent
   * @access Private
   * @query limit - Number of recent messages (default: 20)
   * @returns List of recent messages from all partnerships
   */
  static async getRecentMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { limit = 20 } = req.query as any;

      // This is a simplified implementation - you might want to expand this
      const conversations = await MessageService.getUserConversations(userId, {
        limit: parseInt(limit)
      });

      // Extract recent messages from conversations (temporarily empty since lastMessage is null)
      const recentMessages = conversations.conversations
        .filter(conv => conv.lastMessage && typeof conv.lastMessage === 'object' && conv.lastMessage !== null)
        .map(conv => ({
          ...(conv.lastMessage as any), // Type assertion since we filtered out null
          partnershipTitle: conv.title,
          partner: conv.partner,
          partnerProject: conv.partnerProject
        }))
        .slice(0, parseInt(limit));

      res.status(200).json({
        success: true,
        data: { messages: recentMessages },
        message: 'Recent messages retrieved successfully'
      });
    } catch (error) {
      console.error('Get recent messages error:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get recent messages'
      });
    }
  }
}