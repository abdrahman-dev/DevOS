import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getMyProfile,
  updateProfile,
  getPublicProfile,
  searchProfiles,
} from '../controllers/profile/profileController.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../controllers/profile/profileValidation.js';

const router = Router();

router.get('/search', authMiddleware, searchProfiles);
router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, validate(updateProfileSchema), updateProfile);

router.get('/:username', getPublicProfile);

export default router;
