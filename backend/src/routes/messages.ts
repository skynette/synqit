/**
 * Message Routes
 * 
 * This module defines all routes for messaging functionality in the Synqit platform.
 * It handles message sending, conversation management, message status updates,
 * and message search capabilities.
 * 
 * Routes:
 * - POST /api/messages/send - Send a message
 * - GET /api/messages/conversations - Get all conversations
 * - GET /api/messages/partnerships/:id - Get messages for a partnership
 * - POST /api/messages/mark-read - Mark messages as read
 * - GET /api/messages/unread-count - Get unread message count
 * - GET /api/messages/search - Search messages
 * - DELETE /api/messages/:id - Delete a message
 * - GET /api/messages/stats - Get message statistics
 * - GET /api/messages/recent - Get recent messages
 * 
 * @module routes/messages
 * @requires express - Web framework
 * @requires authenticate - Authentication middleware
 * @requires MessageController - Business logic controller
 * @requires rateLimiter - Rate limiting middleware
 * @requires express-validator - Input validation
 * 
 * @author Synqit Development Team
 * @since 1.0.0
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { MessageController } from '../controllers/messageController';
import { generalLimiter } from '../middleware/rateLimiter';
import { body, param, query } from 'express-validator';

const router = Router();

// All message routes require authentication
router.use(authenticate);

/**
 * Message Sending Validation
 */
const validateSendMessage = [
  body('partnershipId')
    .isUUID()
    .withMessage('Partnership ID must be a valid UUID'),
  body('content')
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message content must be between 1 and 5000 characters')
    .trim(),
  body('messageType')
    .optional()
    .isIn(['TEXT', 'FILE', 'SYSTEM'])
    .withMessage('Invalid message type'),
  body('attachmentUrl')
    .optional()
    .isURL()
    .withMessage('Attachment URL must be a valid URL')
];

/**
 * Mark Messages as Read Validation
 */
const validateMarkAsRead = [
  body('partnershipId')
    .isUUID()
    .withMessage('Partnership ID must be a valid UUID'),
  body('messageIds')
    .optional()
    .isArray()
    .withMessage('Message IDs must be an array')
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.every(id => typeof id === 'string' && id.length > 0);
      }
      return false;
    })
    .withMessage('All message IDs must be valid strings')
];

/**
 * Partnership ID Validation
 */
const validatePartnershipId = [
  param('id')
    .isUUID()
    .withMessage('Partnership ID must be a valid UUID')
];

/**
 * Message ID Validation
 */
const validateMessageId = [
  param('id')
    .isUUID()
    .withMessage('Message ID must be a valid UUID')
];

/**
 * Query Validation for pagination
 */
const validatePaginationQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Search Query Validation
 */
const validateSearchQuery = [
  query('q')
    .isLength({ min: 2, max: 100 })
    .withMessage('Search query must be between 2 and 100 characters'),
  query('partnershipId')
    .optional()
    .isUUID()
    .withMessage('Partnership ID must be a valid UUID'),
  ...validatePaginationQuery
];

/**
 * @route POST /api/messages/send
 * @desc Send a message within a partnership
 * @access Private
 * @middleware generalLimiter, authenticate, validateSendMessage
 */
router.post(
  '/send',
  generalLimiter,
  validateSendMessage,
  MessageController.sendMessage
);

/**
 * @route GET /api/messages/conversations
 * @desc Get all user conversations with latest message
 * @access Private
 * @middleware generalLimiter, authenticate, validatePaginationQuery
 */
router.get(
  '/conversations',
  generalLimiter,
  validatePaginationQuery,
  query('unreadOnly')
    .optional()
    .isBoolean()
    .withMessage('UnreadOnly must be a boolean'),
  MessageController.getUserConversations
);

/**
 * @route GET /api/messages/partnerships/:id
 * @desc Get messages for a specific partnership
 * @access Private
 * @middleware generalLimiter, authenticate, validatePartnershipId, validatePaginationQuery
 */
router.get(
  '/partnerships/:id',
  generalLimiter,
  validatePartnershipId,
  validatePaginationQuery,
  query('before')
    .optional()
    .isISO8601()
    .withMessage('Before date must be in ISO8601 format'),
  query('after')
    .optional()
    .isISO8601()
    .withMessage('After date must be in ISO8601 format'),
  MessageController.getPartnershipMessages
);

/**
 * @route POST /api/messages/mark-read
 * @desc Mark messages as read
 * @access Private
 * @middleware generalLimiter, authenticate, validateMarkAsRead
 */
router.post(
  '/mark-read',
  generalLimiter,
  validateMarkAsRead,
  MessageController.markMessagesAsRead
);

/**
 * @route GET /api/messages/unread-count
 * @desc Get total unread message count for the user
 * @access Private
 * @middleware generalLimiter, authenticate
 */
router.get(
  '/unread-count',
  generalLimiter,
  MessageController.getUnreadMessageCount
);

/**
 * @route GET /api/messages/search
 * @desc Search messages across partnerships
 * @access Private
 * @middleware generalLimiter, authenticate, validateSearchQuery
 */
router.get(
  '/search',
  generalLimiter,
  validateSearchQuery,
  MessageController.searchMessages
);

/**
 * @route GET /api/messages/stats
 * @desc Get message statistics for the user
 * @access Private
 * @middleware generalLimiter, authenticate
 */
router.get(
  '/stats',
  generalLimiter,
  MessageController.getMessageStats
);

/**
 * @route GET /api/messages/recent
 * @desc Get recent messages across all partnerships
 * @access Private
 * @middleware generalLimiter, authenticate
 */
router.get(
  '/recent',
  generalLimiter,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  MessageController.getRecentMessages
);

/**
 * @route DELETE /api/messages/:id
 * @desc Delete a message (soft delete)
 * @access Private
 * @middleware generalLimiter, authenticate, validateMessageId
 */
router.delete(
  '/:id',
  generalLimiter,
  validateMessageId,
  MessageController.deleteMessage
);

export default router;