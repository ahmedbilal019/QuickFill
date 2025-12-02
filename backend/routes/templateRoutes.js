import express from 'express';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  useTemplate
} from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// Template CRUD routes
router.route('/')
  .get(getTemplates)
  .post(createTemplate);

router.route('/:id')
  .get(getTemplateById)
  .put(updateTemplate)
  .delete(deleteTemplate);

// Track template usage
router.post('/:id/use', useTemplate);

export default router;