import { Router } from 'express'
import { getOrganizationMembers, updateMemberRole, removeMember } from '../controllers/organizationController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/:organizationId/members', getOrganizationMembers)
router.put('/:organizationId/members/:memberId/role', updateMemberRole)
router.delete('/:organizationId/members/:memberId', removeMember)

export default router
