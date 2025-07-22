import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';
import { hashPassword, verifyPassword } from '../utils/password';

const prisma = new PrismaClient();

export class ProfileService {
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
          isEmailVerified: true,
          userType: true,
          subscriptionTier: true,
          twoFactorEnabled: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true
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

  static async updateUserProfile(userId: string, updateData: any) {
    try {
      const allowedFields = ['firstName', 'lastName', 'bio', 'walletAddress', 'profileImage'];
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
          isEmailVerified: true,
          userType: true,
          subscriptionTier: true,
          twoFactorEnabled: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw new AppError('Failed to update user profile', 500);
    }
  }

  static async getCompanyProfile(userId: string) {
    try {
      const company = await prisma.company.findUnique({
        where: { ownerId: userId },
        include: {
          blockchainPreferences: {
            select: {
              blockchain: true,
              isPrimary: true
            }
          }
        }
      });

      return company;
    } catch (error) {
      console.error('Get company profile error:', error);
      throw new AppError('Failed to get company profile', 500);
    }
  }

  static async updateCompanyProfile(userId: string, updateData: any) {
    try {
      // Check if user has a company
      const existingCompany = await prisma.company.findUnique({
        where: { ownerId: userId }
      });

      const allowedFields = [
        'name', 'description', 'website', 'logoUrl', 'foundedYear', 'projectType',
        'projectStage', 'tokenAvailability', 'developmentFocus', 'totalFunding',
        'isLookingForFunding', 'isLookingForPartners', 'contactEmail', 'twitterHandle',
        'discordServer', 'telegramGroup', 'country', 'city', 'timezone'
      ];

      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      let company;
      if (existingCompany) {
        // Update existing company
        company = await prisma.company.update({
          where: { ownerId: userId },
          data: filteredData,
          include: {
            blockchainPreferences: {
              select: {
                blockchain: true,
                isPrimary: true
              }
            }
          }
        });
      } else {
        // Create new company
        company = await prisma.company.create({
          data: {
            ...filteredData,
            ownerId: userId
          },
          include: {
            blockchainPreferences: {
              select: {
                blockchain: true,
                isPrimary: true
              }
            }
          }
        });
      }

      return company;
    } catch (error) {
      console.error('Update company profile error:', error);
      throw new AppError('Failed to update company profile', 500);
    }
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
      // Get user with current password
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify old password
      const isValidPassword = await verifyPassword(oldPassword, user.password);
      if (!isValidPassword) {
        throw new AppError('Current password is incorrect', 400);
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      // Invalidate all user sessions (for security)
      await prisma.userSession.updateMany({
        where: { userId },
        data: { isActive: false }
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      console.error('Change password error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to change password', 500);
    }
  }

  static async toggle2FA(userId: string, enabled: boolean) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: enabled },
        select: { 
          id: true,
          twoFactorEnabled: true
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Toggle 2FA error:', error);
      throw new AppError('Failed to toggle 2FA', 500);
    }
  }

  static async deleteAccount(userId: string, password: string) {
    try {
      // Verify password before deletion
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        throw new AppError('Password is incorrect', 400);
      }

      // Delete user (CASCADE will handle related records)
      await prisma.user.delete({
        where: { id: userId }
      });

      return { message: 'Account deleted successfully' };
    } catch (error) {
      console.error('Delete account error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete account', 500);
    }
  }

  static async getBlockchainPreferences(userId: string) {
    try {
      const company = await prisma.company.findUnique({
        where: { ownerId: userId },
        include: {
          blockchainPreferences: {
            select: {
              blockchain: true,
              isPrimary: true
            }
          }
        }
      });

      return company?.blockchainPreferences || [];
    } catch (error) {
      console.error('Get blockchain preferences error:', error);
      throw new AppError('Failed to get blockchain preferences', 500);
    }
  }

  static async updateBlockchainPreferences(userId: string, preferences: any[]) {
    try {
      const company = await prisma.company.findUnique({
        where: { ownerId: userId },
        select: { id: true }
      });

      if (!company) {
        throw new AppError('Company not found', 404);
      }

      // Delete existing preferences
      await prisma.blockchainPreference.deleteMany({
        where: { companyId: company.id }
      });

      // Create new preferences
      if (preferences.length > 0) {
        await prisma.blockchainPreference.createMany({
          data: preferences.map(pref => ({
            companyId: company.id,
            blockchain: pref.blockchain,
            isPrimary: pref.isPrimary || false
          }))
        });
      }

      // Return updated preferences
      const updatedPreferences = await prisma.blockchainPreference.findMany({
        where: { companyId: company.id },
        select: {
          blockchain: true,
          isPrimary: true
        }
      });

      return updatedPreferences;
    } catch (error) {
      console.error('Update blockchain preferences error:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update blockchain preferences', 500);
    }
  }
}