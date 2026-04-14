import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { upload } from '../middleware/upload'
import {
  getAttachments,
  uploadAttachment,
  deleteAttachment,
  downloadAttachment,
} from '../controllers/attachmentController'

const router = Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

// Attachment routes
router.get('/', getAttachments)
router.post('/', upload.single('file'), uploadAttachment)
router.delete('/:attachmentId', deleteAttachment)
router.get('/:attachmentId/download', downloadAttachment)

export default router
