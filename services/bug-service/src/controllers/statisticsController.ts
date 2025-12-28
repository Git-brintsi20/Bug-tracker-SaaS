import { Request, Response } from 'express'
import { PrismaClient } from '../../../../prisma/node_modules/@prisma/client'

const prisma = new PrismaClient()

export const getStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.query

    if (!organizationId) {
      res.status(400).json({ error: 'organizationId is required' })
      return
    }

    // Get bug counts by status
    const statusCounts = await prisma.bug.groupBy({
      by: ['status'],
      where: { organizationId: organizationId as string },
      _count: { status: true },
    })

    // Get bug counts by priority
    const priorityCounts = await prisma.bug.groupBy({
      by: ['priority'],
      where: { organizationId: organizationId as string },
      _count: { priority: true },
    })

    // Get total bugs
    const totalBugs = await prisma.bug.count({
      where: { organizationId: organizationId as string },
    })

    // Get bugs by assignee
    const bugsByAssignee = await prisma.bug.groupBy({
      by: ['assigneeId'],
      where: { 
        organizationId: organizationId as string,
        assigneeId: { not: null },
      },
      _count: { assigneeId: true },
    })

    // Get assignee details
    const assigneeIds = bugsByAssignee
      .map(b => b.assigneeId)
      .filter((id): id is string => id !== null)

    const assignees = await prisma.user.findMany({
      where: { id: { in: assigneeIds } },
      select: { id: true, firstName: true, lastName: true },
    })

    const assigneeMap = new Map(assignees.map(a => [a.id, a]))

    const bugsByAssigneeWithNames = bugsByAssignee.map(b => ({
      assignee: b.assigneeId ? assigneeMap.get(b.assigneeId) : null,
      count: b._count?.assigneeId || 0,
    }))

    // Get recent activity (last 10 bugs)
    const recentActivity = await prisma.bug.findMany({
      where: { organizationId: organizationId as string },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: {
        assignee: {
          select: { firstName: true, lastName: true },
        },
      },
    })

    // Get bugs created in last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentBugsCount = await prisma.bug.count({
      where: {
        organizationId: organizationId as string,
        createdAt: { gte: sevenDaysAgo },
      },
    })

    // Get bugs closed in last 7 days
    const closedBugsCount = await prisma.bug.count({
      where: {
        organizationId: organizationId as string,
        status: 'CLOSED',
        updatedAt: { gte: sevenDaysAgo },
      },
    })

    res.json({
      totalBugs,
      recentBugsCount,
      closedBugsCount,
      statusCounts: statusCounts.map(s => ({
        status: s.status,
        count: s._count.status,
      })),
      priorityCounts: priorityCounts.map(p => ({
        priority: p.priority,
        count: p._count.priority,
      })),
      bugsByAssignee: bugsByAssigneeWithNames,
      recentActivity: recentActivity.map(bug => ({
        id: bug.id,
        title: bug.title,
        status: bug.status,
        priority: bug.priority,
        assignee: bug.assignee ? `${bug.assignee.firstName} ${bug.assignee.lastName}` : null,
        updatedAt: bug.updatedAt,
      })),
    })
  } catch (error) {
    console.error('Get statistics error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
