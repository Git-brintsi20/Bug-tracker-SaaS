import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import bugRoutes from './routes/bugRoutes'
import commentRoutes from './routes/commentRoutes'
import labelRoutes from './routes/labelRoutes'
import attachmentRoutes from './routes/attachmentRoutes'
import exportRoutes from './routes/exportRoutes'
import searchRoutes from './routes/searchRoutes'
import bulkRoutes from './routes/bulkRoutes'
import { connectRedis } from './utils/redis'
import { authenticate } from './middleware/auth'
import { getStatistics } from './controllers/statisticsController'

// Load from services/bug-service directory
dotenv.config({ path: './services/bug-service/.env' })
dotenv.config() // Also try current directory

const app = express()
const PORT = parseInt(process.env.PORT || '5002')

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'bug-service' })
})

app.use('/api/bugs', bugRoutes)
app.use('/api/bugs/:bugId/comments', commentRoutes)
app.use('/api/bugs/:bugId/attachments', attachmentRoutes)
app.use('/api', labelRoutes)
app.use('/api', exportRoutes)
app.use('/api', searchRoutes)
app.use('/api', bulkRoutes)
app.get('/api/statistics', authenticate, getStatistics)

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'))

// Start server FIRST (so Render health check sees the port), then connect Redis in background
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🐛 Bug Service running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`)
})

// Non-blocking: Redis connects in background, cache ops are fail-safe
connectRedis()
