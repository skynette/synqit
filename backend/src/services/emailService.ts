import { Resend } from 'resend';

/**
 * Email Service using Resend
 * Handles email verification, password reset, and other email notifications
 */
export class EmailService {
  private static resend = new Resend(process.env.RESEND_API_KEY);
  private static fromEmail = process.env.FROM_EMAIL || 'Synqit <onboarding@resend.dev>';
  private static baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  /**
   * Send email verification email
   */
  static async sendVerificationEmail(email: string, token: string, firstName: string): Promise<void> {
    const verificationUrl = `${this.baseUrl}/auth/verify-email?token=${token}`;
    
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Verify your email address - Synqit',
        html: this.getVerificationEmailTemplate(firstName, verificationUrl),
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<void> {
    const resetUrl = `${this.baseUrl}/auth/reset-password?token=${token}`;
    
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Reset your password - Synqit',
        html: this.getPasswordResetEmailTemplate(firstName, resetUrl),
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send welcome email after successful verification
   */
  static async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Welcome to Synqit! 🎉',
        html: this.getWelcomeEmailTemplate(firstName),
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email as it's not critical
    }
  }

  /**
   * Email verification template
   */
  private static getVerificationEmailTemplate(firstName: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .button:hover { background: #5a6fd8; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Synqit!</h1>
            <p>Verify your email to get started</p>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Thank you for signing up for Synqit! To complete your registration and start connecting with Web3 projects, please verify your email address.</p>
            <p>Click the button below to verify your email:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with Synqit, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Synqit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Password reset email template
   */
  private static getPasswordResetEmailTemplate(firstName: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .button:hover { background: #5a6fd8; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .security-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
            <p>Reset your Synqit account password</p>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>We received a request to reset your password for your Synqit account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <div class="security-notice">
              <strong>Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour for security reasons</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your password will remain unchanged until you click the link above</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Synqit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Welcome email template
   */
  private static getWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Synqit!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .button:hover { background: #5a6fd8; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .features { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .feature-item { margin: 10px 0; padding: 10px; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Synqit!</h1>
            <p>Your Web3 collaboration journey starts here</p>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Congratulations! Your email has been verified and your Synqit account is now active.</p>
            <p>You're now part of the premier Web3 collaboration platform where innovative projects connect, collaborate, and grow together.</p>
            
            <div class="features">
              <h3>What you can do with Synqit:</h3>
              <div class="feature-item">
                <strong>🔍 Smart Matchmaking:</strong> Find the perfect collaboration partners based on your project needs
              </div>
              <div class="feature-item">
                <strong>💬 Direct Messaging:</strong> Connect directly with potential partners and ecosystem players
              </div>
              <div class="feature-item">
                <strong>🤝 Partnership Management:</strong> Track and manage your collaborations in one place
              </div>
              <div class="feature-item">
                <strong>🌐 Ecosystem Access:</strong> Connect with VCs, agencies, launchpads, and more
              </div>
            </div>
            
            <p>Ready to get started?</p>
            <a href="${this.baseUrl}/dashboard" class="button">Go to Dashboard</a>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy collaborating!</p>
            <p>The Synqit Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Synqit. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
} 