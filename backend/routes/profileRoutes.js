import express from 'express';
import {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  addTemplateToProfile,
  removeTemplateFromProfile
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Profile CRUD routes
router.route('/')
  .get(getProfiles)
  .post(createProfile);

router.route('/:id')
  .get(getProfileById)
  .put(updateProfile)
  .delete(deleteProfile);

// Template management within profiles
router.post('/:id/templates/:templateId', addTemplateToProfile);
router.delete('/:id/templates/:templateId', removeTemplateFromProfile);

export default router;