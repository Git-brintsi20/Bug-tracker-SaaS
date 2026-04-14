"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAttachment = exports.deleteAttachment = exports.uploadAttachment = exports.getAttachments = void 0;
const client_1 = require("@prisma/client");
const redis_1 = require("../utils/redis");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
// Get all attachments for a bug
const getAttachments = async (req, res) => {
    try {
        const { bugId } = req.params;
        const attachments = await prisma.attachment.findMany({
            where: { bugId },
            orderBy: { uploadedAt: 'desc' },
        });
        res.json(attachments);
    }
    catch (error) {
        console.error('Get attachments error:', error);
        res.status(500).json({ error: 'Failed to fetch attachments' });
    }
};
exports.getAttachments = getAttachments;
// Upload attachment
const uploadAttachment = async (req, res) => {
    try {
        const { bugId } = req.params;
        const userId = req.user?.userId;
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        // Verify bug exists
        const bug = await prisma.bug.findUnique({
            where: { id: bugId },
        });
        if (!bug) {
            res.status(404).json({ error: 'Bug not found' });
            return;
        }
        // Create attachment record
        const attachment = await prisma.attachment.create({
            data: {
                filename: req.file.originalname,
                url: `/uploads/${req.file.filename}`,
                mimeType: req.file.mimetype,
                size: req.file.size,
                bugId,
            },
        });
        // Invalidate cache
        await (0, redis_1.deleteCachePattern)(`bugs:*${bug.organizationId}*`);
        res.status(201).json(attachment);
    }
    catch (error) {
        console.error('Upload attachment error:', error);
        res.status(500).json({ error: 'Failed to upload attachment' });
    }
};
exports.uploadAttachment = uploadAttachment;
// Delete attachment
const deleteAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;
        const userId = req.user?.userId;
        // Get attachment
        const attachment = await prisma.attachment.findUnique({
            where: { id: attachmentId },
            include: {
                bug: {
                    select: {
                        organizationId: true,
                        creatorId: true,
                    },
                },
            },
        });
        if (!attachment) {
            res.status(404).json({ error: 'Attachment not found' });
            return;
        }
        // Check if user has permission (bug creator)
        if (attachment.bug.creatorId !== userId) {
            // In a full implementation, check org admin role here
            res.status(403).json({ error: 'Permission denied' });
            return;
        }
        // Delete file from filesystem
        const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
        const filename = path_1.default.basename(attachment.url);
        const filePath = path_1.default.join(uploadsDir, filename);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        // Delete record from database
        await prisma.attachment.delete({
            where: { id: attachmentId },
        });
        // Invalidate cache
        await (0, redis_1.deleteCachePattern)(`bugs:*${attachment.bug.organizationId}*`);
        res.json({ message: 'Attachment deleted successfully' });
    }
    catch (error) {
        console.error('Delete attachment error:', error);
        res.status(500).json({ error: 'Failed to delete attachment' });
    }
};
exports.deleteAttachment = deleteAttachment;
// Download attachment
const downloadAttachment = async (req, res) => {
    try {
        const { attachmentId } = req.params;
        // Get attachment
        const attachment = await prisma.attachment.findUnique({
            where: { id: attachmentId },
        });
        if (!attachment) {
            res.status(404).json({ error: 'Attachment not found' });
            return;
        }
        // Get file path
        const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
        const filename = path_1.default.basename(attachment.url);
        const filePath = path_1.default.join(uploadsDir, filename);
        // Check if file exists
        if (!fs_1.default.existsSync(filePath)) {
            res.status(404).json({ error: 'File not found on server' });
            return;
        }
        // Send file
        res.download(filePath, attachment.filename);
    }
    catch (error) {
        console.error('Download attachment error:', error);
        res.status(500).json({ error: 'Failed to download attachment' });
    }
};
exports.downloadAttachment = downloadAttachment;
