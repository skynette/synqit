import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { DashboardController } from '../controllers/dashboardController';
import { validateCreatePartnership } from '../middleware/validation';
import { param } from 'express-validator';
import { validateCuid } from '../utils/validation';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// ID validation for route parameters
const validateId = [
  param('id')
    .custom(validateCuid)
    .withMessage('ID must be a valid cuid')
];

// Dashboard data endpoints
router.get('/stats', DashboardController.getStats);
router.get('/projects', DashboardController.getProjects);
router.get('/projects/:id', validateId, DashboardController.getProjectById);
router.get('/partnerships', DashboardController.getPartnerships);
router.post('/partnerships', validateCreatePartnership, DashboardController.createPartnership);
router.get('/partnerships/:id', validateId, DashboardController.getPartnershipById);
router.put('/partnerships/:id/accept', validateId, DashboardController.acceptPartnership);
router.put('/partnerships/:id/reject', validateId, DashboardController.rejectPartnership);
router.delete('/partnerships/:id', validateId, DashboardController.cancelPartnership);
router.get('/messages', DashboardController.getMessages);
router.get('/notifications', DashboardController.getNotifications);
router.get('/profile', DashboardController.getProfile);

export default router;