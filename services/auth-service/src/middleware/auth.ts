import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'

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
      const decoded = verifyAccessToken(token)
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
