"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const attachmentController_1 = require("../controllers/attachmentController");
const router = (0, express_1.Router)({ mergeParams: true });
// All routes require authentication
router.use(auth_1.authenticate);
// Attachment routes
router.get('/', attachmentController_1.getAttachments);
router.post('/', upload_1.upload.single('file'), attachmentController_1.uploadAttachment);
router.delete('/:attachmentId', attachmentController_1.deleteAttachment);
router.get('/:attachmentId/download', attachmentController_1.downloadAttachment);
exports.default = router;
