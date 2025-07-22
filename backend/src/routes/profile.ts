import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { ProfileController } from '../controllers/profileController';
import { profileValidation } from '../middleware/profileValidation';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// User profile endpoints
router.get('/user', ProfileController.getUserProfile);
router.put('/user', profileValidation.updateUserProfile, ProfileController.updateUserProfile);
router.post('/user/upload-profile-image', ProfileController.uploadProfileImage);

// Company profile endpoints
router.get('/company', ProfileController.getCompanyProfile);
router.put('/company', profileValidation.updateCompanyProfile, ProfileController.updateCompanyProfile);
router.post('/company/upload-logo', ProfileController.uploadCompanyLogo);
router.post('/company/upload-banner', ProfileController.uploadCompanyBanner);

// Security endpoints
router.post('/change-password', profileValidation.changePassword, ProfileController.changePassword);
router.post('/toggle-2fa', ProfileController.toggle2FA);
router.delete('/delete-account', ProfileController.deleteAccount);

// Blockchain preferences endpoints
router.get('/blockchain-preferences', ProfileController.getBlockchainPreferences);
router.put('/blockchain-preferences', profileValidation.updateBlockchainPreferences, ProfileController.updateBlockchainPreferences);

export default router;