import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const JWT_SECRET = process.env.JWT_SECRET!

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      req.userId = decoded.userId
      next()
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' })
      return
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}
