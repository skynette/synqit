import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { 
  AuthenticatedRequest, 
  RegisterRequest, 
  LoginRequest, 
  EmailVerificationRequest,
  ResendVerificationRequest,
  PasswordResetRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangeEmailRequest
} from '../types/auth';

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
        message: 'User registered successfully. Please check your email for verification.',
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
   * Verify email address
   * POST /api/auth/verify-email
   */
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token }: EmailVerificationRequest = req.body;
      
      if (!token) {
        res.status(400).json({
          status: 'error',
          message: 'Verification token is required',
        });
        return;
      }

      const result = await AuthService.verifyEmail(token);
      
      if (result.success) {
        res.status(200).json({
          status: 'success',
          message: result.message,
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: result.message,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Email verification failed',
      });
    }
  }

  /**
   * Resend email verification
   * POST /api/auth/resend-verification
   */
  static async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const { email }: ResendVerificationRequest = req.body;
      
      if (!email) {
        res.status(400).json({
          status: 'error',
          message: 'Email is required',
        });
        return;
      }

      const result = await AuthService.resendVerificationEmail(email);
      
      if (result.success) {
        res.status(200).json({
          status: 'success',
          message: result.message,
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: result.message,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to resend verification email',
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
   * Initiate password reset
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email }: PasswordResetRequest = req.body;
      
      if (!email) {
        res.status(400).json({
          status: 'error',
          message: 'Email is required',
        });
        return;
      }

      const result = await AuthService.initiatePasswordReset(email);
      
      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Password reset failed',
      });
    }
  }

  /**
   * Reset password using token
   * POST /api/auth/reset-password
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword }: ResetPasswordRequest = req.body;
      
      if (!token || !newPassword) {
        res.status(400).json({
          status: 'error',
          message: 'Token and new password are required',
        });
        return;
      }

      const result = await AuthService.resetPassword(token, newPassword);
      
      if (result.success) {
        res.status(200).json({
          status: 'success',
          message: result.message,
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: result.message,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Password reset failed',
      });
    }
  }

  /**
   * Change password (authenticated user)
   * POST /api/auth/change-password
   */
  static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      const { currentPassword, newPassword }: ChangePasswordRequest = req.body;
      
      if (!currentPassword || !newPassword) {
        res.status(400).json({
          status: 'error',
          message: 'Current password and new password are required',
        });
        return;
      }

      const result = await AuthService.changePassword(req.user.id, currentPassword, newPassword);
      
      if (result.success) {
        res.status(200).json({
          status: 'success',
          message: result.message,
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: result.message,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Password change failed',
      });
    }
  }

  /**
   * Change email (authenticated user)
   * POST /api/auth/change-email
   */
  static async changeEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      const { newEmail }: ChangeEmailRequest = req.body;
      
      if (!newEmail) {
        res.status(400).json({
          status: 'error',
          message: 'New email is required',
        });
        return;
      }

      const result = await AuthService.changeEmail(req.user.id, newEmail);
      
      if (result.success) {
        res.status(200).json({
          status: 'success',
          message: result.message,
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: result.message,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Email change failed',
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