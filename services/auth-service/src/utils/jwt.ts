import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m'
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d'

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE as any,
  })
}

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE as any,
  })
}

export const verifyAccessToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string }
}

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string }
}
