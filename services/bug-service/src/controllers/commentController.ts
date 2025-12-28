import { Request, Response } from 'express'
import { PrismaClient } from '../../../../prisma/node_modules/@prisma/client'
import { publishNotification } from '../utils/redis'

const prisma = new PrismaClient()

export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bugId } = req.params

    const comments = await prisma.comment.findMany({
      where: { bugId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    res.json(comments)
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bugId } = req.params
    const { content } = req.body
    const userId = req.userId!

    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Comment content is required' })
      return
    }

    // Verify bug exists and get organization ID
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      select: { organizationId: true },
    })

    if (!bug) {
      res.status(404).json({ error: 'Bug not found' })
      return
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        bugId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    // Publish real-time notification
    await publishNotification(bug.organizationId, 'comment-added', {
      ...comment,
      bugId,
    })

    res.status(201).json(comment)
  } catch (error) {
    console.error('Create comment error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
