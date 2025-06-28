import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest, RegisterRequest, LoginRequest } from '../types/auth';

/**
 * Authentication Controller
 * Handles user authentication endpoints
 */
export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }
      
      const registerData: RegisterRequest = req.body;
      const result = await AuthService.register(registerData);
      
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Registration failed',
      });
    }
  }
  
  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }
      
      const loginData: LoginRequest = req.body;
      const result = await AuthService.login(loginData);
      
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Login failed',
      });
    }
  }
  
  /**
   * Logout user
   * POST /api/auth/logout
   */
  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.sessionId) {
        res.status(400).json({
          status: 'error',
          message: 'No active session found',
        });
        return;
      }
      
      await AuthService.logout(req.sessionId);
      
      res.status(200).json({
        status: 'success',
        message: 'Logout successful',
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Logout failed',
      });
    }
  }
  
  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = req.user as any;
      
      res.status(200).json({
        status: 'success',
        data: {
          user: userWithoutPassword,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch profile',
      });
    }
  }
  
  /**
   * Refresh token
   * POST /api/auth/refresh
   */
  static async refreshToken(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }
      
      // Create new session (this will invalidate the old one)
      const result = await AuthService.login({
        email: req.user.email,
        password: '', // We won't check password for refresh
      });
      
      res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Token refresh failed',
      });
    }
  }
} 