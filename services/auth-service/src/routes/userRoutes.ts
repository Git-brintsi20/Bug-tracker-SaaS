import { Router } from 'express'
import { updateProfile, changePassword, getOrganizations } from '../controllers/userController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.put('/me', updateProfile)
router.post('/me/change-password', changePassword)
router.get('/me/organizations', getOrganizations)

export default router
