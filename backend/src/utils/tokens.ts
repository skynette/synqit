import { randomBytes, createHash } from 'crypto';

/**
 * Token utilities for email verification and password reset
 */
export class TokenUtils {
  /**
   * Generate a secure random token
   */
  static generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Generate email verification token with expiry
   */
  static generateEmailVerificationToken(): { token: string; expiresAt: Date } {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry
    
    return { token, expiresAt };
  }

  /**
   * Generate password reset token with expiry
   */
  static generatePasswordResetToken(): { token: string; expiresAt: Date } {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry
    
    return { token, expiresAt };
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  /**
   * Hash token for secure storage (optional, for additional security)
   */
  static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate a short numeric code (for 2FA or backup codes)
   */
  static generateNumericCode(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  /**
   * Generate 2FA backup codes
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(this.generateNumericCode(8));
    }
    return codes;
  }
} 