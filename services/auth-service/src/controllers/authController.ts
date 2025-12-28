import { Request, Response } from 'express'
import { PrismaClient } from '../../../../prisma/node_modules/@prisma/client'
import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'

const prisma = new PrismaClient()

// OAuth Success Handler
export const oauthSuccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as any

    if (!user) {
      res.status(401).json({ error: 'Authentication failed' })
      return
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // Redirect to frontend with tokens
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000'
    res.redirect(`${frontendURL}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`)
  } catch (error) {
    console.error('OAuth success handler error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, firstName, lastName } = req.body

    // Validate input
    if (!email || !username || !password) {
      res.status(400).json({ error: 'Email, username, and password are required' })
      return
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      res.status(400).json({ error: 'User with this email or username already exists' })
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        createdAt: true,
      },
    })

    // Generate tokens
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    res.status(201).json({
      user,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Generate tokens
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' })
      return
    }

    try {
      const decoded = verifyRefreshToken(refreshToken)
      
      // Generate new access token
      const accessToken = generateAccessToken(decoded.userId)

      res.json({ accessToken })
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' })
      return
    }
  } catch (error) {
    console.error('Refresh error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ user })
  } catch (error) {
    console.error('Me error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  // Client-side should remove tokens
  res.json({ message: 'Logged out successfully' })
}
