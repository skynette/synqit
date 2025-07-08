import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import utilities and middleware
import { connectDatabase, disconnectDatabase } from './lib/database';
import { generalLimiter, authLimiter } from './middleware/rateLimiter';
import { AuthService } from './services/authService';
import apiRoutes from './routes';

/**
 * Synqit Backend Server
 * Web3 Matchmaking Platform API
 */

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting and security headers
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration - Allow all origins for development
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, you might want to restrict this to specific origins
    // For now, allow all origins as requested
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);

// Apply auth-specific rate limiting to auth routes
app.use('/api/auth', authLimiter);

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Synqit API',
    version: '1.0.0',
    documentation: 'https://docs.synqit.com',
    endpoints: {
      api: '/api',
      health: '/api/health',
      auth: '/api/auth',
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Something went wrong!';
  
  res.status(err.status || 500).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

/**
 * Start server and connect to database
 */
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    
    // Clean up expired sessions on startup
    await AuthService.cleanupExpiredSessions();
    
    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Synqit API server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('📴 SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    });
    
    process.on('SIGINT', async () => {
      console.log('📴 SIGINT received, shutting down gracefully...');
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app; 