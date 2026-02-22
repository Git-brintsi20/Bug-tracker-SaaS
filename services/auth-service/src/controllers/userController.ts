import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!
    const { firstName, lastName, email } = req.body

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      })

      if (existingUser) {
        res.status(400).json({ error: 'Email already in use' })
        return
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    })

    res.json(user)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' })
      return
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    if (!user.password) {
      res.status(400).json({ error: 'Cannot change password for OAuth accounts' })
      return
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      res.status(400).json({ error: 'Current password is incorrect' })
      return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
