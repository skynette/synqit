import { User } from '@prisma/client';
import { prisma } from '../lib/database';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/password';
import { generateToken, getTokenExpiry } from '../utils/jwt';
import { TokenUtils } from '../utils/tokens';
import { EmailService } from './emailService';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

/**
 * Authentication Service
 * Handles user registration, login, email verification, password reset, and session management
 */
export class AuthService {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  /**
   * Register a new user with email verification
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const { email, password, firstName, lastName, userType, bio, walletAddress } = data;
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Check wallet address uniqueness if provided
    if (walletAddress) {
      const existingWallet = await prisma.user.findUnique({
        where: { walletAddress },
      });
      
      if (existingWallet) {
        throw new Error('User with this wallet address already exists');
      }
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Generate email verification token
    const { token: verificationToken, expiresAt: verificationExpiry } = TokenUtils.generateEmailVerificationToken();
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        userType,
        bio,
        walletAddress,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
        isEmailVerified: false,
      },
    });
    
    // Send verification email
    await EmailService.sendVerificationEmail(user.email, verificationToken, firstName);
    
    // Create session (user can login but will be reminded to verify email)
    const sessionToken = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
      subscriptionTier: user.subscriptionTier,
      sessionId: '',
    });
    
    const expiresAt = getTokenExpiry();
    
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
      },
    });
    
    // Update token with session ID
    const finalToken = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
      subscriptionTier: user.subscriptionTier,
      sessionId: session.id,
    });
    
    await prisma.userSession.update({
      where: { id: session.id },
      data: { token: finalToken },
    });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: finalToken,
      expiresAt,
    };
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    // Find user by verification token
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return { success: false, message: 'Invalid verification token' };
    }

    // Check if token is expired
    if (!user.emailVerificationExpiry || TokenUtils.isTokenExpired(user.emailVerificationExpiry)) {
      return { success: false, message: 'Verification token has expired' };
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    // Send welcome email
    await EmailService.sendWelcomeEmail(user.email, user.firstName);

    return { success: true, message: 'Email verified successfully' };
  }

  /**
   * Resend email verification
   */
  static async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.isEmailVerified) {
      return { success: false, message: 'Email is already verified' };
    }

    // Generate new verification token
    const { token: verificationToken, expiresAt: verificationExpiry } = TokenUtils.generateEmailVerificationToken();

    // Update user with new token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // Send verification email
    await EmailService.sendVerificationEmail(user.email, verificationToken, user.firstName);

    return { success: true, message: 'Verification email sent successfully' };
  }

  /**
   * Login user with enhanced security
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockedUntil.getTime() - new Date().getTime()) / 1000 / 60);
      throw new Error(`Account is locked. Try again in ${remainingTime} minutes.`);
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      // Increment failed attempts
      const newFailedAttempts = user.failedLoginAttempts + 1;
      let updateData: any = {
        failedLoginAttempts: newFailedAttempts,
      };

      // Lock account if max attempts reached
      if (newFailedAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + this.LOCKOUT_DURATION);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      throw new Error('Invalid email or password');
    }

    // Reset failed attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });
    
    // Create new session
    const expiresAt = getTokenExpiry();
    
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        token: '', // Will be updated below
        expiresAt,
      },
    });
    
    // Generate token with session ID
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
      subscriptionTier: user.subscriptionTier,
      sessionId: session.id,
    });
    
    // Update session with token
    await prisma.userSession.update({
      where: { id: session.id },
      data: { token },
    });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
      expiresAt,
    };
  }

  /**
   * Initiate password reset
   */
  static async initiatePasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return { success: true, message: 'If the email exists, a password reset link will be sent' };
    }

    // Generate password reset token
    const { token: resetToken, expiresAt: resetExpiry } = TokenUtils.generatePasswordResetToken();

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });

    // Send password reset email
    await EmailService.sendPasswordResetEmail(user.email, resetToken, user.firstName);

    return { success: true, message: 'If the email exists, a password reset link will be sent' };
  }

  /**
   * Reset password using token
   */
  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    // Find user by reset token
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user) {
      return { success: false, message: 'Invalid or expired reset token' };
    }

    // Check if token is expired
    if (!user.passwordResetExpiry || TokenUtils.isTokenExpired(user.passwordResetExpiry)) {
      return { success: false, message: 'Reset token has expired' };
    }

    // Validate new password
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return { 
        success: false, 
        message: `Password validation failed: ${passwordValidation.errors.join(', ')}` 
      };
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user with new password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
        failedLoginAttempts: 0, // Reset failed attempts
        lockedUntil: null, // Unlock account
      },
    });

    // Invalidate all existing sessions for security
    await prisma.userSession.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    });

    return { success: true, message: 'Password reset successfully' };
  }

  /**
   * Change password (authenticated user)
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return { success: false, message: 'Current password is incorrect' };
    }

    // Validate new password
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return { 
        success: false, 
        message: `Password validation failed: ${passwordValidation.errors.join(', ')}` 
      };
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user with new password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { success: true, message: 'Password changed successfully' };
  }

  /**
   * Change email (authenticated user)
   */
  static async changeEmail(userId: string, newEmail: string): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if new email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, message: 'Email is already in use' };
    }

    // Generate email verification token for new email
    const { token: verificationToken, expiresAt: verificationExpiry } = TokenUtils.generateEmailVerificationToken();

    // Update user with new email and verification token
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail.toLowerCase(),
        isEmailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // Send verification email to new address
    await EmailService.sendVerificationEmail(newEmail, verificationToken, user.firstName);

    return { success: true, message: 'Email changed successfully. Please verify your new email address.' };
  }
  
  /**
   * Logout user (invalidate session)
   */
  static async logout(sessionId: string): Promise<void> {
    await prisma.userSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }
  
  /**
   * Validate session
   */
  static async validateSession(sessionId: string): Promise<User | null> {
    const session = await prisma.userSession.findUnique({
      where: { 
        id: sessionId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
    
    return session?.user || null;
  }
  
  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(): Promise<void> {
    await prisma.userSession.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        isActive: true,
      },
      data: { isActive: false },
    });
  }
} 