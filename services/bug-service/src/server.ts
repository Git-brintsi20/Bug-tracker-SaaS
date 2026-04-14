import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import path from 'path'
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

// Load service-local environment and override any inherited global variables.
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true })

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

// Organization-level routes
app.get('/api/organizations/:organizationId/bugs', authenticate, async (req, res) => {
  // Inject organizationId into query parameters
  req.query.organizationId = req.params.organizationId
  // Import and call getBugs handler
  const { getBugs } = await import('./controllers/bugController.js')
  return getBugs(req, res)
})

app.get('/api/organizations/:organizationId/bugs/statistics', authenticate, async (req, res) => {
  req.query.organizationId = req.params.organizationId
  return getStatistics(req, res)
})

app.post('/api/organizations/:organizationId/bugs/bulk/status', authenticate, async (req, res) => {
  req.body.organizationId = req.params.organizationId
  const { bulkUpdateStatus } = await import('./controllers/bulkController.js')
  return bulkUpdateStatus(req, res)
})

app.post('/api/organizations/:organizationId/bugs/bulk/priority', authenticate, async (req, res) => {
  req.body.organizationId = req.params.organizationId
  const { bulkUpdatePriority } = await import('./controllers/bulkController.js')
  return bulkUpdatePriority(req, res)
})

app.post('/api/organizations/:organizationId/bugs/bulk/assign', authenticate, async (req, res) => {
  req.body.organizationId = req.params.organizationId
  const { bulkAssign } = await import('./controllers/bulkController.js')
  return bulkAssign(req, res)
})

app.post('/api/organizations/:organizationId/bugs/bulk/labels', authenticate, async (req, res) => {
  req.body.organizationId = req.params.organizationId
  const { bulkAddLabels } = await import('./controllers/bulkController.js')
  return bulkAddLabels(req, res)
})

app.post('/api/organizations/:organizationId/bugs/bulk/delete', authenticate, async (req, res) => {
  req.body.organizationId = req.params.organizationId
  const { bulkDelete } = await import('./controllers/bulkController.js')
  return bulkDelete(req, res)
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
