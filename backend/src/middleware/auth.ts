import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../types/auth';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Access token required',
      });
      return;
    }
    
    // Verify token
    const payload = verifyToken(token);
    
    // Validate session
    const user = await AuthService.validateSession(payload.sessionId);
    
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session',
      });
      return;
    }
    
    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.sessionId = payload.sessionId;
    
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid authentication token',
    });
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if token is provided, but doesn't require it
 */
export async function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const payload = verifyToken(token);
      const user = await AuthService.validateSession(payload.sessionId);
      
      if (user) {
        req.user = user;
        req.userId = user.id;
        req.sessionId = payload.sessionId;
      }
    }
    
    next();
  } catch (error) {
    // Ignore auth errors for optional authentication
    next();
  }
}

/**
 * Subscription tier authorization middleware
 */
export function requireSubscription(allowedTiers: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
      return;
    }
    
    if (!allowedTiers.includes(req.user.subscriptionTier)) {
      res.status(403).json({
        status: 'error',
        message: 'Subscription upgrade required',
        requiredTiers: allowedTiers,
        currentTier: req.user.subscriptionTier,
      });
      return;
    }
    
    next();
  };
} 