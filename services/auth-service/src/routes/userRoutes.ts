import { Router } from 'express'
import { updateProfile, changePassword } from '../controllers/userController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

router.put('/me', updateProfile)
router.post('/me/change-password', changePassword)

export default router
