import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import {
  getAttachments,
  uploadAttachment,
  deleteAttachment,
  downloadAttachment,
} from '../controllers/attachmentController.js'

const router = Router({ mergeParams: true })

// All routes require authentication
router.use(authenticate)

// Attachment routes
router.get('/', getAttachments)
router.post('/', upload.single('file'), uploadAttachment)
router.delete('/:attachmentId', deleteAttachment)
router.get('/:attachmentId/download', downloadAttachment)

export default router
