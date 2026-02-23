import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables FIRST before any other imports
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import passport from './utils/passport'
import authRoutes from './routes/authRoutes'
import organizationRoutes from './routes/organizationRoutes'
import userRoutes from './routes/userRoutes'
import { errorHandler } from './middleware/errorHandler'

const app = express()
const PORT = Number(process.env.PORT) || 5001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
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
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`)
})
