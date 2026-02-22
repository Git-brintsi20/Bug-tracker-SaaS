import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getOrganizationMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params

    const members = await prisma.organizationMember.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    })

    res.json(members)
  } catch (error) {
    console.error('Get organization members error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateMemberRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, memberId } = req.params
    const { role } = req.body

    if (!['ADMIN', 'DEVELOPER', 'VIEWER'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' })
      return
    }

    const member = await prisma.organizationMember.update({
      where: {
        id: memberId,
        organizationId,
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    res.json(member)
  } catch (error) {
    console.error('Update member role error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const removeMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId, memberId } = req.params

    await prisma.organizationMember.delete({
      where: {
        id: memberId,
        organizationId,
      },
    })

    res.json({ message: 'Member removed successfully' })
  } catch (error) {
    console.error('Remove member error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
