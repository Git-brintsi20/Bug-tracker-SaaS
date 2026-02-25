import { Router } from 'express'
import { getComments, createComment } from '../controllers/commentController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router({ mergeParams: true })

router.use(authenticate)

router.get('/', getComments)
router.post('/', createComment)

export default router
