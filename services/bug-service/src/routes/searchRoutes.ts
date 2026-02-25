import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { searchBugs, getSearchSuggestions } from '../controllers/searchController.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Search routes
router.get('/organizations/:organizationId/search', searchBugs)
router.get('/organizations/:organizationId/search/suggestions', getSearchSuggestions)

export default router
