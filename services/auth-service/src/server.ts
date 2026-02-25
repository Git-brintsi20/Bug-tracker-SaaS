import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables FIRST before any other imports
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import passport from './utils/passport.js'
import authRoutes from './routes/authRoutes.js'
import organizationRoutes from './routes/organizationRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = Number(process.env.PORT) || 5001

// Middleware
app.use(helmet())

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://bug-tracker-saas.vercel.app',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed as string))) {
      callback(null, true)
    } else {
      console.warn('⚠️  CORS blocked origin:', origin)
      callback(null, true) // Allow in development, log warning
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize Passport
app.use(passport.initialize())

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' })
})

app.use('/api/auth', authRoutes)
app.use('/api/organizations', organizationRoutes)
app.use('/api/users', userRoutes)

// Error handler
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔐 Auth Service running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 Allowed Origins:`, allowedOrigins)
  console.log(`🔑 GitHub OAuth:`, process.env.GITHUB_CLIENT_ID ? '✓ Configured' : '✗ Not configured')
  console.log(`🔑 Google OAuth:`, process.env.GOOGLE_CLIENT_ID ? '✓ Configured' : '✗ Not configured')
})
