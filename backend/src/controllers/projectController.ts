import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProjectService } from '../services/projectService';
import { AuthenticatedRequest } from '../types/auth';

/**
 * Project Controller
 * Handles project management endpoints
 */
export class ProjectController {
  /**
   * Get current user's project
   * GET /api/project
   */
  static async getMyProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      const project = await ProjectService.getProjectByUserId(req.user.id);
      
      res.status(200).json({
        status: 'success',
        data: {
          project,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch project',
      });
    }
  }

  /**
   * Create or update user's project
   * POST /api/project
   */
  static async createOrUpdateProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      const projectData = req.body;
      const project = await ProjectService.createOrUpdateProject(req.user.id, projectData);
      
      res.status(200).json({
        status: 'success',
        message: 'Project saved successfully',
        data: {
          project,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to save project',
      });
    }
  }

  /**
   * Get project by ID (for viewing other projects)
   * GET /api/project/:id
   */
  static async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          status: 'error',
          message: 'Project ID is required',
        });
        return;
      }

      const project = await ProjectService.getProjectById(id, true); // true = increment view count
      
      if (!project) {
        res.status(404).json({
          status: 'error',
          message: 'Project not found',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: {
          project,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch project',
      });
    }
  }

  /**
   * Get all projects (for explore page)
   * GET /api/projects
   */
  static async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const projects = await ProjectService.getProjects(filters);
      
      res.status(200).json({
        status: 'success',
        data: projects,
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch projects',
      });
    }
  }

  /**
   * Delete user's project
   * DELETE /api/project
   */
  static async deleteProject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      await ProjectService.deleteProject(req.user.id);
      
      res.status(200).json({
        status: 'success',
        message: 'Project deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        status: 'error',
        message: error.message || 'Failed to delete project',
      });
    }
  }

  /**
   * Upload project logo
   * POST /api/project/upload-logo
   */
  static async uploadLogo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      // TODO: Implement file upload logic
      res.status(501).json({
        status: 'error',
        message: 'File upload not implemented yet',
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to upload logo',
      });
    }
  }

  /**
   * Upload project banner
   * POST /api/project/upload-banner
   */
  static async uploadBanner(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
        return;
      }

      // TODO: Implement file upload logic
      res.status(501).json({
        status: 'error',
        message: 'File upload not implemented yet',
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to upload banner',
      });
    }
  }
}