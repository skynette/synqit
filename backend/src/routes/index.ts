import { Router } from 'express';
import authRoutes from './auth';
import dashboardRoutes from './dashboard';
import profileRoutes from './profile';
import projectRoutes from './project';
import projectsRoutes from './projects';
import matchesRoutes from './matches';
import messagesRoutes from './messages';
import companiesRoutes from './companies';

const router = Router();

/**
 * API Routes
 * Base path: /api
 */

// Health check (mounted at root level)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Synqit API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Authentication routes
router.use('/auth', authRoutes);

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

// Profile routes
router.use('/profile', profileRoutes);

// Project routes
router.use('/project', projectRoutes);
router.use('/projects', projectsRoutes); // Plural route for public project listing

// Matching/Partnership routes
router.use('/matches', matchesRoutes);

// Messaging routes
router.use('/messages', messagesRoutes);

// Companies routes
router.use('/companies', companiesRoutes);

// API info
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Synqit API',
    version: '1.0.0',
    documentation: '/api/docs', // Future documentation endpoint
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      profile: '/api/profile',
      project: '/api/project',
      matches: '/api/matches',
      messages: '/api/messages',
      companies: '/api/companies',
    },
  });
});

export default router; 