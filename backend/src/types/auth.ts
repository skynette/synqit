import { User } from '@prisma/client';

// Import enums from Prisma
type UserType = 'STARTUP' | 'INVESTOR' | 'ECOSYSTEM_PLAYER' | 'INDIVIDUAL';
type SubscriptionTier = 'FREE' | 'PREMIUM' | 'ENTERPRISE';

/**
 * JWT Payload interface
 */
export interface JWTPayload {
  userId: string;
  email: string;
  userType: UserType;
  subscriptionTier: SubscriptionTier;
  sessionId: string;
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: User;
  userId?: string;
  sessionId?: string;
}

// Import Request from express
import { Request } from 'express';

/**
 * Registration request body
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  bio?: string;
  walletAddress?: string;
}

/**
 * Login request body
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Email verification request body
 */
export interface EmailVerificationRequest {
  token: string;
}

/**
 * Resend verification email request body
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * Password reset request body
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Reset password request body
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Change password request body
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Change email request body
 */
export interface ChangeEmailRequest {
  newEmail: string;
}

/**
 * Auth response
 */
export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  expiresAt: Date;
}

/**
 * Standard API response
 */
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
} 