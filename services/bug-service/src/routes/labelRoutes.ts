import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel,
  addLabelToBug,
  removeLabelFromBug,
} from '../controllers/labelController'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Label management routes
router.get('/organizations/:organizationId/labels', getLabels)
router.post('/organizations/:organizationId/labels', createLabel)
router.put('/organizations/:organizationId/labels/:labelId', updateLabel)
router.delete('/organizations/:organizationId/labels/:labelId', deleteLabel)

// Bug-label association routes
router.post('/bugs/:bugId/labels/:labelId', addLabelToBug)
router.delete('/bugs/:bugId/labels/:labelId', removeLabelFromBug)

export default router
