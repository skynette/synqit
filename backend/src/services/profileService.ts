import { prisma } from '../lib/database';
import { AppError } from '../utils/errors';

/**
 * Profile Service
 * Handles user and project profile related operations
 */
export class ProfileService {
  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          bio: true,
          walletAddress: true,
          userType: true,
          subscriptionTier: true,
          isVerified: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          project: {
            include: {
              blockchainPreferences: true,
              tags: true,
              _count: {
                select: {
                  sentPartnerships: true,
                  receivedPartnerships: true,
                }
              }
            }
          },
          _count: {
            select: {
              sentPartnershipRequests: true,
              receivedPartnershipRequests: true,
              sentMessages: true,
              receivedMessages: true,
            }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw new AppError('Failed to get user profile', 500);
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updateData: any) {
    try {
      const allowedFields = [
        'firstName', 'lastName', 'bio', 'profileImage', 'walletAddress'
      ];

      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: filteredData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          bio: true,
          walletAddress: true,
          userType: true,
          subscriptionTier: true,
          isVerified: true,
          isEmailVerified: true,
          updatedAt: true,
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw new AppError('Failed to update user profile', 500);
    }
  }

  /**
   * Get user's project profile
   */
  static async getProjectProfile(userId: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { ownerId: userId },
        include: {
          blockchainPreferences: {
            select: {
              blockchain: true,
              isPrimary: true
            }
          },
          tags: {
            select: {
              tag: true
            }
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profileImage: true,
              userType: true,
            }
          },
          _count: {
            select: {
              sentPartnerships: true,
              receivedPartnerships: true,
            }
          }
        }
      });

      return project;
    } catch (error) {
      console.error('Get project profile error:', error);
      throw new AppError('Failed to get project profile', 500);
    }
  }

  /**
   * Update user's project profile
   */
  static async updateProjectProfile(userId: string, updateData: any) {
    try {
      // Check if user has a project
      const existingProject = await prisma.project.findUnique({
        where: { ownerId: userId }
      });

      const allowedFields = [
        'name', 'description', 'website', 'logoUrl', 'bannerUrl', 'foundedYear', 
        'projectType', 'projectStage', 'tokenAvailability', 'developmentFocus', 
        'totalFunding', 'isLookingForFunding', 'isLookingForPartners', 'contactEmail', 
        'twitterHandle', 'discordServer', 'telegramGroup', 'facebookPage', 
        'phoneNumber', 'phoneCountryCode', 'redditCommunity', 
        'githubUrl', 'whitepaperUrl', 'country', 'city', 'timezone', 'teamSize', 
        'fundingStage'
      ];

      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      let project;
      if (existingProject) {
        // Update existing project
        project = await prisma.project.update({
          where: { ownerId: userId },
          data: filteredData,
          include: {
            blockchainPreferences: {
              select: {
                blockchain: true,
                isPrimary: true
              }
            },
            tags: {
              select: {
                tag: true
              }
            }
          }
        });
      } else {
        // Create new project - ensure required fields
        if (!filteredData.name || !filteredData.description) {
          throw new AppError('Project name and description are required', 400);
        }

        project = await prisma.project.create({
          data: {
            ...filteredData,
            ownerId: userId,
            trustScore: 0,
            viewCount: 0,
            isVerified: false
          },
          include: {
            blockchainPreferences: {
              select: {
                blockchain: true,
                isPrimary: true
              }
            },
            tags: {
              select: {
                tag: true
              }
            }
          }
        });
      }

      return project;
    } catch (error) {
      console.error('Update project profile error:', error);
      throw new AppError('Failed to update project profile', 500);
    }
  }

  /**
   * Get blockchain preferences for user's project
   */
  static async getBlockchainPreferences(userId: string) {
    try {
      const project = await prisma.project.findUnique({
        where: { ownerId: userId },
        select: {
          blockchainPreferences: {
            select: {
              blockchain: true,
              isPrimary: true
            },
            orderBy: {
              isPrimary: 'desc'
            }
          }
        }
      });

      return project?.blockchainPreferences || [];
    } catch (error) {
      console.error('Get blockchain preferences error:', error);
      throw new AppError('Failed to get blockchain preferences', 500);
    }
  }

  /**
   * Update blockchain preferences for user's project
   */
  static async updateBlockchainPreferences(userId: string, preferences: Array<{ blockchain: any; isPrimary: boolean }>) {
    try {
      const project = await prisma.project.findUnique({
        where: { ownerId: userId },
        select: { id: true }
      });

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      await prisma.$transaction(async (prisma) => {
        // Delete existing preferences
        await prisma.blockchainPreference.deleteMany({
          where: { projectId: project.id }
        });

        // Create new preferences
        if (preferences.length > 0) {
          await prisma.blockchainPreference.createMany({
            data: preferences.map(pref => ({
              projectId: project.id,
              blockchain: pref.blockchain,
              isPrimary: pref.isPrimary
            }))
          });
        }
      });

      // Return updated preferences
      return await prisma.blockchainPreference.findMany({
        where: { projectId: project.id },
        select: {
          blockchain: true,
          isPrimary: true
        },
        orderBy: {
          isPrimary: 'desc'
        }
      });
    } catch (error) {
      console.error('Update blockchain preferences error:', error);
      throw new AppError('Failed to update blockchain preferences', 500);
    }
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
      // Get current user with password
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, password: true }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Import bcrypt for password verification and hashing
      const bcrypt = require('bcrypt');
      
      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw new AppError('New password must be at least 8 characters long', 400);
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password in database
      await prisma.user.update({
        where: { id: userId },
        data: { 
          password: hashedNewPassword,
          updatedAt: new Date()
        }
      });

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Change password error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to change password', 500);
    }
  }

  /**
   * Toggle 2FA  
   */
  static async toggle2FA(userId: string, enable: boolean, secret?: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          id: true, 
          twoFactorEnabled: true, 
          twoFactorSecret: true,
          email: true 
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (enable) {
        // Enabling 2FA
        if (user.twoFactorEnabled) {
          throw new AppError('2FA is already enabled', 400);
        }

        // Generate secret if not provided
        let twoFactorSecret = secret;
        if (!twoFactorSecret) {
          const speakeasy = require('speakeasy');
          const secretObj = speakeasy.generateSecret({
            name: `Synqit (${user.email})`,
            issuer: 'Synqit'
          });
          twoFactorSecret = secretObj.base32;
        }

        // Generate backup codes
        const crypto = require('crypto');
        const backupCodes = Array.from({ length: 10 }, () => 
          crypto.randomBytes(4).toString('hex').toUpperCase()
        );

        // Update user with 2FA settings
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            twoFactorEnabled: true,
            twoFactorSecret: twoFactorSecret,
            twoFactorBackupCodes: backupCodes,
            updatedAt: new Date()
          },
          select: {
            twoFactorEnabled: true,
            twoFactorBackupCodes: true
          }
        });

        // Generate QR code for the secret
        const qrCode = require('qrcode');
        const otpauth = `otpauth://totp/Synqit:${user.email}?secret=${twoFactorSecret}&issuer=Synqit`;
        const qrCodeDataURL = await qrCode.toDataURL(otpauth);

        return {
          enabled: true,
          secret: twoFactorSecret,
          qrCode: qrCodeDataURL,
          backupCodes: updatedUser.twoFactorBackupCodes,
          message: '2FA enabled successfully. Save your backup codes in a secure location.'
        };

      } else {
        // Disabling 2FA
        if (!user.twoFactorEnabled) {
          throw new AppError('2FA is already disabled', 400);
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            twoFactorEnabled: false,
            twoFactorSecret: null,
            twoFactorBackupCodes: [],
            updatedAt: new Date()
          }
        });

        return {
          enabled: false,
          message: '2FA disabled successfully'
        };
      }
    } catch (error) {
      console.error('Toggle 2FA error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to toggle 2FA', 500);
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(userId: string) {
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          project: {
            include: {
              _count: {
                select: {
                  sentPartnerships: true,
                  receivedPartnerships: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Use transaction to ensure all deletions happen atomically
      await prisma.$transaction(async (prisma) => {
        // If user has a project, delete all related data
        if (user.project) {
          const projectId = user.project.id;

          // Delete project tags
          await prisma.projectTag.deleteMany({
            where: { projectId }
          });

          // Delete blockchain preferences
          await prisma.blockchainPreference.deleteMany({
            where: { projectId }
          });

          // Delete partnerships (both sent and received)
          await prisma.partnership.deleteMany({
            where: {
              OR: [
                { requesterProjectId: projectId },
                { receiverProjectId: projectId }
              ]
            }
          });

          // Delete the project
          await prisma.project.delete({
            where: { id: projectId }
          });
        }

        // Delete user's messages (both sent and received)
        await prisma.message.deleteMany({
          where: {
            OR: [
              { senderId: userId },
              { receiverId: userId }
            ]
          }
        });

        // Delete user's notifications
        await prisma.notification.deleteMany({
          where: { userId }
        });

        // Delete user's sessions
        await prisma.userSession.deleteMany({
          where: { userId }
        });

        // Finally, delete the user account
        await prisma.user.delete({
          where: { id: userId }
        });
      });

      return { 
        success: true, 
        message: 'Account and all associated data deleted successfully' 
      };
    } catch (error) {
      console.error('Delete account error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete account', 500);
    }
  }
}