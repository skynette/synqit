import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { validateProject, validateProjectFilters } from '../middleware/projectValidation';
import { generalLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   GET /api/project
 * @desc    Get current user's project
 * @access  Private
 */
router.get(
  '/',
  generalLimiter,
  authenticate,
  ProjectController.getMyProject
);

/**
 * @route   POST /api/project
 * @desc    Create or update user's project
 * @access  Private
 */
router.post(
  '/',
  generalLimiter,
  authenticate,
  validateProject,
  ProjectController.createOrUpdateProject
);

/**
 * @route   DELETE /api/project
 * @desc    Delete user's project
 * @access  Private
 */
router.delete(
  '/',
  generalLimiter,
  authenticate,
  ProjectController.deleteProject
);

/**
 * @route   GET /api/projects
 * @desc    Get all projects with filtering
 * @access  Public
 */
router.get(
  '/all',
  generalLimiter,
  validateProjectFilters,
  ProjectController.getProjects
);

/**
 * @route   GET /api/project/:id
 * @desc    Get project by ID
 * @access  Public
 */
router.get(
  '/:id',
  generalLimiter,
  ProjectController.getProjectById
);

/**
 * @route   POST /api/project/upload-logo
 * @desc    Upload project logo
 * @access  Private
 */
router.post(
  '/upload-logo',
  generalLimiter,
  authenticate,
  ProjectController.uploadLogo
);

/**
 * @route   POST /api/project/upload-banner
 * @desc    Upload project banner
 * @access  Private
 */
router.post(
  '/upload-banner',
  generalLimiter,
  authenticate,
  ProjectController.uploadBanner
);

export default router;