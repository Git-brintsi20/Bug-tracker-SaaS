import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { exportBugsCSV, exportBugsPDF } from '../controllers/exportController'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Export routes
router.get('/organizations/:organizationId/export/csv', exportBugsCSV)
router.get('/organizations/:organizationId/export/pdf', exportBugsPDF)

export default router
