import { Router } from 'express'
import { getBugs, getBugById, createBug, updateBug, deleteBug } from '../controllers/bugController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', getBugs)
router.get('/:id', getBugById)
router.post('/', createBug)
router.put('/:id', updateBug)
router.delete('/:id', deleteBug)

export default router
