import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const searchBugs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params
    const { 
      query, 
      status, 
      priority, 
      assigneeId, 
      reporterId,
      labelIds,
      dateFrom,
      dateTo,
      page = '1',
      limit = '50',
    } = req.query

    // Build search filter
    const where: any = { organizationId }

    // Text search across title and description
    if (query && typeof query === 'string') {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Status filter
    if (status) {
      if (typeof status === 'string') {
        where.status = status
      } else if (Array.isArray(status)) {
        where.status = { in: status }
      }
    }

    // Priority filter
    if (priority) {
      if (typeof priority === 'string') {
        where.priority = priority
      } else if (Array.isArray(priority)) {
        where.priority = { in: priority }
      }
    }

    // Assignee filter
    if (assigneeId) {
      where.assigneeId = assigneeId
    }

    // Reporter filter
    if (reporterId) {
      where.creatorId = reporterId
    }

    // Label filter
    if (labelIds) {
      const labelIdArray = typeof labelIds === 'string' ? labelIds.split(',') : labelIds
      where.labels = {
        some: {
          id: { in: labelIdArray },
        },
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom as string)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo as string)
      }
    }

    // Pagination
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Execute search with pagination
    const [bugs, total] = await Promise.all([
      prisma.bug.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          labels: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          _count: {
            select: {
              comments: true,
              attachments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.bug.count({ where }),
    ])

    res.json({
      bugs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error('Search bugs error:', error)
    res.status(500).json({ error: 'Failed to search bugs' })
  }
}

// Get search suggestions (autocomplete)
export const getSearchSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params
    const { query } = req.query

    if (!query || typeof query !== 'string') {
      res.json({ suggestions: [] })
      return
    }

    // Search for matching bug titles
    const bugs = await prisma.bug.findMany({
      where: {
        organizationId,
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
      },
      take: 10,
      orderBy: { updatedAt: 'desc' },
    })

    res.json({ suggestions: bugs })
  } catch (error) {
    console.error('Search suggestions error:', error)
    res.status(500).json({ error: 'Failed to get search suggestions' })
  }
}
