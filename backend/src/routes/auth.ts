import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { 
  validateRegister, 
  validateLogin, 
  validateEmailVerification,
  validateResendVerification,
  validatePasswordReset,
  validateResetPassword,
  validateChangePassword,
  validateChangeEmail
} from '../middleware/validation';

const router = Router();

/**
 * Authentication Routes
 * Base path: /api/auth
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, AuthController.register);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address using token
 * @access  Public
 */
router.post('/verify-email', validateEmailVerification, AuthController.verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification email
 * @access  Public
 */
router.post('/resend-verification', validateResendVerification, AuthController.resendVerification);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, AuthController.login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Initiate password reset process
 * @access  Public
 */
router.post('/forgot-password', validatePasswordReset, AuthController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password', validateResetPassword, AuthController.resetPassword);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password (authenticated user)
 * @access  Private
 */
router.post('/change-password', authenticate, validateChangePassword, AuthController.changePassword);

/**
 * @route   POST /api/auth/change-email
 * @desc    Change email address (authenticated user)
 * @access  Private
 */
router.post('/change-email', authenticate, validateChangeEmail, AuthController.changeEmail);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate session)
 * @access  Private
 */
router.post('/logout', authenticate, AuthController.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, AuthController.getProfile);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh authentication token
 * @access  Private
 */
router.post('/refresh', authenticate, AuthController.refreshToken);

export default router; 