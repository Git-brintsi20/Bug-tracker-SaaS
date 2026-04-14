import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import {
  bulkUpdateStatus,
  bulkUpdatePriority,
  bulkAssign,
  bulkDelete,
  bulkAddLabels,
} from '../controllers/bulkController'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Bulk operations routes
router.post('/bugs/bulk/status', bulkUpdateStatus)
router.post('/bugs/bulk/priority', bulkUpdatePriority)
router.post('/bugs/bulk/assign', bulkAssign)
router.post('/bugs/bulk/delete', bulkDelete)
router.post('/bugs/bulk/labels', bulkAddLabels)

export default router
