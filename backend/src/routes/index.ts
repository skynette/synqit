import { Router } from 'express';
import authRoutes from './auth';
import dashboardRoutes from './dashboard';
import profileRoutes from './profile';
import projectRoutes from './project';

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
    },
  });
});

export default router; 