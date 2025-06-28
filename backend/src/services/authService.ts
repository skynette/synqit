import { User } from '@prisma/client';
import { prisma } from '../lib/database';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/password';
import { generateToken, getTokenExpiry } from '../utils/jwt';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

/**
 * Authentication Service
 * Handles user registration, login, and session management
 */
export class AuthService {
  /**
   * Register a new user
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
      },
    });
    
    // Create session
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
   * Login user
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
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
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