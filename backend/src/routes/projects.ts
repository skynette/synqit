import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { validateProjectFilters } from '../middleware/projectValidation';
import { generalLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects with filtering (public endpoint)
 * @access  Public
 */
router.get(
  '/',
  generalLimiter,
  validateProjectFilters,
  ProjectController.getProjects
);

export default router;