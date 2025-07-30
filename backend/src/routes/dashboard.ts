import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// Dashboard data endpoints
router.get('/stats', DashboardController.getStats);
router.get('/projects', DashboardController.getProjects);
router.get('/projects/:id', DashboardController.getProjectById);
router.get('/partnerships', DashboardController.getPartnerships);
router.get('/partnerships/:id', DashboardController.getPartnershipById);
router.get('/messages', DashboardController.getMessages);
router.get('/notifications', DashboardController.getNotifications);
router.get('/profile', DashboardController.getProfile);

export default router;