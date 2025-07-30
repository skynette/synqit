import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { ProfileService } from '../services/profileService';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/errors';

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

  static async uploadProfileImage(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      // TODO: Implement file upload logic
      
      res.status(200).json({
        success: true,
        message: 'Profile image upload endpoint ready'
      });
    } catch (error) {
      console.error('Upload profile image error:', error);
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

  static async uploadCompanyLogo(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      // TODO: Implement file upload logic
      
      res.status(200).json({
        success: true,
        message: 'Company logo upload endpoint ready'
      });
    } catch (error) {
      console.error('Upload company logo error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload company logo'
      });
    }
  }

  static async uploadCompanyBanner(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      // TODO: Implement file upload logic
      
      res.status(200).json({
        success: true,
        message: 'Company banner upload endpoint ready'
      });
    } catch (error) {
      console.error('Upload company banner error:', error);
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