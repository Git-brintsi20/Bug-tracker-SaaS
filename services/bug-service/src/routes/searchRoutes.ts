import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { searchBugs, getSearchSuggestions } from '../controllers/searchController'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Search routes
router.get('/organizations/:organizationId/search', searchBugs)
router.get('/organizations/:organizationId/search/suggestions', getSearchSuggestions)

export default router
