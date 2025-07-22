import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { DashboardService } from '../services/dashboardService';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/errors';

export class DashboardController {
    static async getStats(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const stats = await DashboardService.getUserStats(userId);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get dashboard stats'
            });
        }
    }

    static async getCompanies(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const {
                page = 1,
                limit = 50,
                search = '',
                projectType,
                projectStage,
                blockchain,
                tokenAvailability,
                fundingStatus,
                teamSize,
                developmentFocus,
                tab = 'trending'
            } = req.query;

            const filters = {
                search: search as string,
                projectType: projectType as string,
                projectStage: projectStage as string,
                blockchain: blockchain as string,
                tokenAvailability: tokenAvailability as string,
                fundingStatus: fundingStatus as string,
                teamSize: teamSize as string,
                developmentFocus: developmentFocus as string,
                tab: tab as string
            };

            const companies = await DashboardService.getCompanies(
                userId,
                parseInt(page as string),
                parseInt(limit as string),
                filters
            );

            res.status(200).json({
                success: true,
                data: companies
            });
        } catch (error) {
            console.error('Get companies error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get companies'
            });
        }
    }

    static async getCompanyById(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const companyId = req.params.id;

            const company = await DashboardService.getCompanyById(userId, companyId);

            if (!company) {
                return res.status(404).json({
                    success: false,
                    message: 'Company not found'
                });
            }

            res.status(200).json({
                success: true,
                data: company
            });
        } catch (error) {
            console.error('Get company by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get company details'
            });
        }
    }

    static async getPartnerships(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const {
                page = 1,
                limit = 20,
                status = 'all',
                type = 'all'
            } = req.query;

            const partnerships = await DashboardService.getPartnerships(
                userId,
                parseInt(page as string),
                parseInt(limit as string),
                status as string,
                type as string
            );

            res.status(200).json({
                success: true,
                data: partnerships
            });
        } catch (error) {
            console.error('Get partnerships error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get partnerships'
            });
        }
    }

    static async getPartnershipById(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const partnershipId = req.params.id;

            const partnership = await DashboardService.getPartnershipById(userId, partnershipId);

            if (!partnership) {
                return res.status(404).json({
                    success: false,
                    message: 'Partnership not found'
                });
            }

            res.status(200).json({
                success: true,
                data: partnership
            });
        } catch (error) {
            console.error('Get partnership by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get partnership details'
            });
        }
    }

    static async getMessages(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const {
                page = 1,
                limit = 20,
                conversationId
            } = req.query;

            const messages = await DashboardService.getMessages(
                userId,
                parseInt(page as string),
                parseInt(limit as string),
                conversationId as string
            );

            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            console.error('Get messages error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get messages'
            });
        }
    }

    static async getNotifications(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const {
                page = 1,
                limit = 20,
                unreadOnly = false
            } = req.query;

            const notifications = await DashboardService.getNotifications(
                userId,
                parseInt(page as string),
                parseInt(limit as string),
                unreadOnly === 'true'
            );

            res.status(200).json({
                success: true,
                data: notifications
            });
        } catch (error) {
            console.error('Get notifications error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get notifications'
            });
        }
    }

    static async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user!.id;
            const profile = await DashboardService.getProfile(userId);

            res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get profile'
            });
        }
    }
}