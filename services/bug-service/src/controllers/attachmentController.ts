import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { deleteCachePattern } from '../utils/redis'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

// Get all attachments for a bug
export const getAttachments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bugId } = req.params

    const attachments = await prisma.attachment.findMany({
      where: { bugId },
      orderBy: { uploadedAt: 'desc' },
    })

    res.json(attachments)
  } catch (error) {
    console.error('Get attachments error:', error)
    res.status(500).json({ error: 'Failed to fetch attachments' })
  }
}

// Upload attachment
export const uploadAttachment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bugId } = req.params
    const userId = (req as any).user?.userId

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    // Verify bug exists
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    })

    if (!bug) {
      res.status(404).json({ error: 'Bug not found' })
      return
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
    })

    // Invalidate cache
    await deleteCachePattern(`bugs:*${bug.organizationId}*`)

    res.status(201).json(attachment)
  } catch (error) {
    console.error('Upload attachment error:', error)
    res.status(500).json({ error: 'Failed to upload attachment' })
  }
}

// Delete attachment
export const deleteAttachment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { attachmentId } = req.params
    const userId = (req as any).user?.userId

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
    })

    if (!attachment) {
      res.status(404).json({ error: 'Attachment not found' })
      return
    }

    // Check if user has permission (bug creator)
    if (attachment.bug.creatorId !== userId) {
      // In a full implementation, check org admin role here
      res.status(403).json({ error: 'Permission denied' })
      return
    }

    // Delete file from filesystem
    const uploadsDir = path.join(process.cwd(), 'uploads')
    const filename = path.basename(attachment.url)
    const filePath = path.join(uploadsDir, filename)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete record from database
    await prisma.attachment.delete({
      where: { id: attachmentId },
    })

    // Invalidate cache
    await deleteCachePattern(`bugs:*${attachment.bug.organizationId}*`)

    res.json({ message: 'Attachment deleted successfully' })
  } catch (error) {
    console.error('Delete attachment error:', error)
    res.status(500).json({ error: 'Failed to delete attachment' })
  }
}

// Download attachment
export const downloadAttachment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { attachmentId } = req.params

    // Get attachment
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    })

    if (!attachment) {
      res.status(404).json({ error: 'Attachment not found' })
      return
    }

    // Get file path
    const uploadsDir = path.join(process.cwd(), 'uploads')
    const filename = path.basename(attachment.url)
    const filePath = path.join(uploadsDir, filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found on server' })
      return
    }

    // Send file
    res.download(filePath, attachment.filename)
  } catch (error) {
    console.error('Download attachment error:', error)
    res.status(500).json({ error: 'Failed to download attachment' })
  }
}
