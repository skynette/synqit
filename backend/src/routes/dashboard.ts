import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { DashboardController } from '../controllers/dashboardController';
import { validateCreatePartnership } from '../middleware/validation';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// Dashboard data endpoints
router.get('/stats', DashboardController.getStats);
router.get('/projects', DashboardController.getProjects);
router.get('/projects/:id', DashboardController.getProjectById);
router.get('/partnerships', DashboardController.getPartnerships);
router.post('/partnerships', validateCreatePartnership, DashboardController.createPartnership);
router.get('/partnerships/:id', DashboardController.getPartnershipById);
router.put('/partnerships/:id/accept', DashboardController.acceptPartnership);
router.put('/partnerships/:id/reject', DashboardController.rejectPartnership);
router.delete('/partnerships/:id', DashboardController.cancelPartnership);
router.get('/messages', DashboardController.getMessages);
router.get('/notifications', DashboardController.getNotifications);
router.get('/profile', DashboardController.getProfile);

export default router;