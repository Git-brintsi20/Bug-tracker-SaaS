import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const isProduction = redisUrl.startsWith('rediss://')

const redisClient = createClient({
  url: redisUrl,
  pingInterval: 1000,
  socket: {
    tls: isProduction,
    rejectUnauthorized: false,
    connectTimeout: 10000,
    reconnectStrategy: (retries: number) => {
      const delay = Math.min(retries * 100, 3000)
      console.log(`Redis connection lost. Retrying in ${delay}ms...`)
      return delay
    },
  },
})

let redisReady = false

redisClient.on('error', (err) => {
  redisReady = false
  console.error('Redis Client Error', err.message)
})
redisClient.on('ready', () => {
  redisReady = true
  console.log('📦 Redis Client Ready')
})
redisClient.on('end', () => {
  redisReady = false
  console.log('📦 Redis Client Disconnected')
})

// Non-blocking connect — never throws, just logs
export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect()
    }
  } catch (err: any) {
    console.error('Redis initial connect failed (will retry in background):', err.message)
  }
}

// All cache operations are fail-safe: errors return null / no-op
export const getCache = async (key: string): Promise<string | null> => {
  try {
    if (!redisReady) return null
    return await redisClient.get(key)
  } catch { return null }
}

export const setCache = async (key: string, value: string, ttl: number = 300): Promise<void> => {
  try {
    if (!redisReady) return
    await redisClient.setEx(key, ttl, value)
  } catch { /* ignore */ }
}

export const deleteCache = async (key: string): Promise<void> => {
  try {
    if (!redisReady) return
    await redisClient.del(key)
  } catch { /* ignore */ }
}

export const deleteCachePattern = async (pattern: string): Promise<void> => {
  try {
    if (!redisReady) return
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(keys)
    }
  } catch { /* ignore */ }
}

export const publishNotification = async (organizationId: string, event: string, data: any): Promise<void> => {
  try {
    if (!redisReady) return
    await redisClient.publish('notifications', JSON.stringify({
      organizationId,
      event,
      data,
    }))
  } catch (error) {
    console.error('Error publishing notification:', error)
  }
}

export default redisClient
