import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ProfileService } from '../services/profileService';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/errors';
import { deleteImage, extractPublicId } from '../config/cloudinary';

export class ProfileController {
  static async getUserProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await ProfileService.getUserProfile(userId);
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile'
      });
    }
  }

  static async updateUserProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user!.id;
      const updateData = req.body;
      
      const updatedProfile = await ProfileService.updateUserProfile(userId, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }

  /**
   * Upload user profile image
   * @route POST /api/profile/image
   * @access Private
   * @middleware profileImageUpload.single('profileImage')
   */
  static async uploadProfileImage(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Get current user profile to delete old image if exists
      const currentProfile = await ProfileService.getUserProfile(userId);
      
      // Delete old profile image from Cloudinary if exists
      if (currentProfile?.profileImage) {
        const oldPublicId = extractPublicId(currentProfile.profileImage);
        if (oldPublicId) {
          await deleteImage(oldPublicId);
        }
      }
      
      // Update user profile with new image URL
      const updatedProfile = await ProfileService.updateUserProfile(userId, {
        profileImage: file.path // Cloudinary URL
      });
      
      res.status(200).json({
        success: true,
        data: {
          profileImage: file.path,
          profile: updatedProfile
        },
        message: 'Profile image uploaded successfully'
      });
    } catch (error) {
      console.error('Upload profile image error:', error);
      
      // If file was uploaded but database update failed, clean up
      if (req.file) {
        const publicId = extractPublicId(req.file.path);
        if (publicId) {
          try {
            await deleteImage(publicId);
          } catch (cleanupError) {
            console.error('Failed to cleanup uploaded file:', cleanupError);
          }
        }
      }
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to upload profile image'
      });
    }
  }

  static async getCompanyProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await ProfileService.getProjectProfile(userId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Company profile not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Get company profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get company profile'
      });
    }
  }

  static async updateCompanyProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user!.id;
      const updateData = req.body;
      
      const updatedProfile = await ProfileService.updateProjectProfile(userId, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Company profile updated successfully'
      });
    } catch (error) {
      console.error('Update company profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update company profile'
      });
    }
  }

  /**
   * Upload company logo
   * @route POST /api/profile/company/logo
   * @access Private
   * @middleware companyLogoUpload.single('companyLogo')
   */
  static async uploadCompanyLogo(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No logo file provided'
        });
      }

      // Get current company profile to delete old logo if exists
      const currentProfile = await ProfileService.getProjectProfile(userId);
      
      // Delete old logo from Cloudinary if exists
      // Note: Current schema uses logoUrl, not companyLogo
      if (currentProfile?.logoUrl) {
        const oldPublicId = extractPublicId(currentProfile.logoUrl);
        if (oldPublicId) {
          await deleteImage(oldPublicId);
        }
      }
      
      // Update company profile with new logo URL
      const updatedProfile = await ProfileService.updateProjectProfile(userId, {
        logoUrl: file.path
      });
      
      res.status(200).json({
        success: true,
        data: {
          companyLogo: file.path,
          profile: updatedProfile
        },
        message: 'Company logo uploaded successfully'
      });
    } catch (error) {
      console.error('Upload company logo error:', error);
      
      // Cleanup uploaded file on error
      if (req.file) {
        const publicId = extractPublicId(req.file.path);
        if (publicId) {
          try {
            await deleteImage(publicId);
          } catch (cleanupError) {
            console.error('Failed to cleanup uploaded file:', cleanupError);
          }
        }
      }
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to upload company logo'
      });
    }
  }

  /**
   * Upload company banner
   * @route POST /api/profile/company/banner
   * @access Private
   * @middleware companyBannerUpload.single('companyBanner')
   */
  static async uploadCompanyBanner(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'No banner file provided'
        });
      }

      // Get current company profile to delete old banner if exists
      const currentProfile = await ProfileService.getProjectProfile(userId);
      
      // Delete old banner from Cloudinary if exists
      // Note: Current schema uses bannerUrl, not companyBanner
      if (currentProfile?.bannerUrl) {
        const oldPublicId = extractPublicId(currentProfile.bannerUrl);
        if (oldPublicId) {
          await deleteImage(oldPublicId);
        }
      }
      
      // Update company profile with new banner URL
      const updatedProfile = await ProfileService.updateProjectProfile(userId, {
        bannerUrl: file.path
      });
      
      res.status(200).json({
        success: true,
        data: {
          companyBanner: file.path,
          profile: updatedProfile
        },
        message: 'Company banner uploaded successfully'
      });
    } catch (error) {
      console.error('Upload company banner error:', error);
      
      // Cleanup uploaded file on error
      if (req.file) {
        const publicId = extractPublicId(req.file.path);
        if (publicId) {
          try {
            await deleteImage(publicId);
          } catch (cleanupError) {
            console.error('Failed to cleanup uploaded file:', cleanupError);
          }
        }
      }
      
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to upload company banner'
      });
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user!.id;
      const { oldPassword, newPassword } = req.body;
      
      await ProfileService.changePassword(userId, oldPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }
  }

  static async toggle2FA(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user!.id;
      const { enabled, secret } = req.body;
      
      const result = await ProfileService.toggle2FA(userId, enabled, secret);
      
      res.status(200).json({
        success: true,
        data: result,
        message: result.message
      });
    } catch (error) {
      console.error('Toggle 2FA error:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to toggle 2FA'
      });
    }
  }

  static async deleteAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user!.id;
      const result = await ProfileService.deleteAccount(userId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Delete account error:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to delete account'
      });
    }
  }

  static async getBlockchainPreferences(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const preferences = await ProfileService.getBlockchainPreferences(userId);
      
      res.status(200).json({
        success: true,
        data: preferences
      });
    } catch (error) {
      console.error('Get blockchain preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get blockchain preferences'
      });
    }
  }

  static async updateBlockchainPreferences(req: AuthenticatedRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user!.id;
      const { preferences } = req.body;
      
      const updatedPreferences = await ProfileService.updateBlockchainPreferences(userId, preferences);
      
      res.status(200).json({
        success: true,
        data: updatedPreferences,
        message: 'Blockchain preferences updated successfully'
      });
    } catch (error) {
      console.error('Update blockchain preferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update blockchain preferences'
      });
    }
  }
}