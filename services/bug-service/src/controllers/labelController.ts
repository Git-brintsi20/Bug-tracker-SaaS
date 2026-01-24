import { Request, Response } from 'express'
import { PrismaClient } from '../../../../prisma/node_modules/@prisma/client'
import { deleteCachePattern } from '../utils/redis'

const prisma = new PrismaClient()

// Get all labels for an organization
export const getLabels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params

    // Get all bugs for organization and extract unique labels
    const bugs = await prisma.bug.findMany({
      where: { organizationId },
      include: {
        labels: true,
      },
    })

    // Extract unique labels
    const labelsMap = new Map()
    bugs.forEach(bug => {
      bug.labels.forEach(label => {
        if (!labelsMap.has(label.id)) {
          labelsMap.set(label.id, label)
        }
      })
    })

    const labels = Array.from(labelsMap.values()).sort((a, b) => a.name.localeCompare(b.name))

    res.json(labels)
  } catch (error) {
    console.error('Get labels error:', error)
    res.status(500).json({ error: 'Failed to fetch labels' })
  }
}

// Create a new label
export const createLabel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = req.params
    const { name, color, bugId } = req.body

    // Validate input
    if (!name || !color || !bugId) {
      res.status(400).json({ error: 'Name, color, and bugId are required' })
      return
    }

    // Verify bug exists and belongs to organization
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    })

    if (!bug) {
      res.status(404).json({ error: 'Bug not found' })
      return
    }

    if (bug.organizationId !== organizationId) {
      res.status(403).json({ error: 'Bug does not belong to this organization' })
      return
    }

    // Check if label with same name exists for this bug
    const existingLabel = await prisma.label.findFirst({
      where: {
        bugId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    })

    if (existingLabel) {
      res.status(400).json({ error: 'Label with this name already exists for this bug' })
      return
    }

    const label = await prisma.label.create({
      data: {
        name,
        color,
        bugId,
      },
    })

    // Invalidate cache
    await deleteCachePattern(`bugs:*${organizationId}*`)

    res.status(201).json(label)
  } catch (error) {
    console.error('Create label error:', error)
    res.status(500).json({ error: 'Failed to create label' })
  }
}

// Update a label
export const updateLabel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { labelId, organizationId } = req.params
    const { name, color } = req.body

    // Check if label exists
    const existingLabel = await prisma.label.findUnique({
      where: { id: labelId },
      include: {
        bug: {
          select: {
            organizationId: true,
          },
        },
      },
    })

    if (!existingLabel) {
      res.status(404).json({ error: 'Label not found' })
      return
    }

    // Verify organization ownership
    if (existingLabel.bug.organizationId !== organizationId) {
      res.status(403).json({ error: 'Label does not belong to this organization' })
      return
    }

    // If name is being changed, check for duplicates on the same bug
    if (name && name !== existingLabel.name) {
      const duplicateLabel = await prisma.label.findFirst({
        where: {
          bugId: existingLabel.bugId,
          name: {
            equals: name,
            mode: 'insensitive',
          },
          id: {
            not: labelId,
          },
        },
      })

      if (duplicateLabel) {
        res.status(400).json({ error: 'Label with this name already exists for this bug' })
        return
      }
    }

    const label = await prisma.label.update({
      where: { id: labelId },
      data: {
        name: name || undefined,
        color: color || undefined,
      },
    })

    // Invalidate cache
    await deleteCachePattern(`bugs:*${existingLabel.bug.organizationId}*`)

    res.json(label)
  } catch (error) {
    console.error('Update label error:', error)
    res.status(500).json({ error: 'Failed to update label' })
  }
}

// Delete a label
export const deleteLabel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { labelId, organizationId } = req.params

    // Check if label exists
    const existingLabel = await prisma.label.findUnique({
      where: { id: labelId },
      include: {
        bug: {
          select: {
            organizationId: true,
          },
        },
      },
    })

    if (!existingLabel) {
      res.status(404).json({ error: 'Label not found' })
      return
    }

    // Verify organization ownership
    if (existingLabel.bug.organizationId !== organizationId) {
      res.status(403).json({ error: 'Label does not belong to this organization' })
      return
    }

    // Delete the label
    await prisma.label.delete({
      where: { id: labelId },
    })

    // Invalidate cache
    await deleteCachePattern(`bugs:*${existingLabel.bug.organizationId}*`)

    res.json({ 
      message: 'Label deleted successfully',
    })
  } catch (error) {
    console.error('Delete label error:', error)
    res.status(500).json({ error: 'Failed to delete label' })
  }
}

// Add label to bug
export const addLabelToBug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bugId } = req.params
    const { name, color } = req.body

    // Verify bug exists
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    })

    if (!bug) {
      res.status(404).json({ error: 'Bug not found' })
      return
    }

    // Check if label with same name already exists for this bug
    const existingLabel = await prisma.label.findFirst({
      where: {
        bugId,
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    })

    if (existingLabel) {
      res.status(400).json({ error: 'Label with this name already exists for this bug' })
      return
    }

    // Create the label
    const label = await prisma.label.create({
      data: {
        name,
        color,
        bugId,
      },
    })

    // Invalidate cache
    await deleteCachePattern(`bugs:*${bug.organizationId}*`)

    res.status(201).json({ message: 'Label added to bug successfully', label })
  } catch (error) {
    console.error('Add label to bug error:', error)
    res.status(500).json({ error: 'Failed to add label to bug' })
  }
}

// Remove label from bug
export const removeLabelFromBug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { labelId } = req.params

    // Verify label exists
    const label = await prisma.label.findUnique({
      where: { id: labelId },
      include: {
        bug: {
          select: {
            id: true,
            organizationId: true,
          },
        },
      },
    })

    if (!label) {
      res.status(404).json({ error: 'Label not found' })
      return
    }

    // Delete the label
    await prisma.label.delete({
      where: { id: labelId },
    })

    // Invalidate cache
    await deleteCachePattern(`bugs:*${label.bug.organizationId}*`)

    res.json({ message: 'Label removed from bug successfully' })
  } catch (error) {
    console.error('Remove label from bug error:', error)
    res.status(500).json({ error: 'Failed to remove label from bug' })
  }
}
