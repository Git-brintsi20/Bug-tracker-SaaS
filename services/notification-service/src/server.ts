import { Server } from 'socket.io'
import { createServer } from 'http'
import dotenv from 'dotenv'
import { createClient } from 'redis'

dotenv.config()

const PORT = parseInt(process.env.PORT || '5003')
const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

const redisClient = createClient({
  url: redisUrl,
  socket: redisUrl.startsWith('rediss://') ? { tls: true, rejectUnauthorized: false } : undefined,
})

redisClient.on('error', (err) => console.error('Redis Client Error', err))
redisClient.on('connect', () => console.log('📦 Redis connected'))

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`)

  socket.on('join-organization', (organizationId: string) => {
    socket.join(`org:${organizationId}`)
    console.log(`User ${socket.id} joined organization ${organizationId}`)
  })

  socket.on('leave-organization', (organizationId: string) => {
    socket.leave(`org:${organizationId}`)
    console.log(`User ${socket.id} left organization ${organizationId}`)
  })

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`)
  })
})

// Redis subscriber for cross-service notifications
const startRedisSubscriber = async () => {
  const subscriber = redisClient.duplicate()
  await subscriber.connect()

  await subscriber.subscribe('notifications', (message) => {
    try {
      const notification = JSON.parse(message)
      const { organizationId, event, data } = notification

      if (organizationId) {
        io.to(`org:${organizationId}`).emit(event, data)
      } else {
        io.emit(event, data)
      }
    } catch (error) {
      console.error('Error processing notification:', error)
    }
  })

  console.log('📡 Subscribed to Redis notifications channel')
}

const start = async () => {
  try {
    await redisClient.connect()
    await startRedisSubscriber()

    httpServer.listen(PORT, () => {
      console.log(`🔔 Notification Service running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV}`)
      console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`)
    })
  } catch (error) {
    console.error('Failed to start notification service:', error)
    process.exit(1)
  }
}

start()
