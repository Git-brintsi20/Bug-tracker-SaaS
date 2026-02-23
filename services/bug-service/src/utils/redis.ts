import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const isTls = redisUrl.startsWith('rediss://')

const redisClient = createClient({
  url: redisUrl,
  pingInterval: 1000,
  socket: {
    tls: isTls,
    rejectUnauthorized: false,
    keepAlive: 3000,
    connectTimeout: 10000,
    reconnectStrategy: (retries: number) => {
      const delay = Math.min(retries * 100, 3000)
      console.log(`Redis connection lost. Retrying in ${delay}ms...`)
      return delay
    },
  },
})

redisClient.on('error', (err) => console.error('Redis Client Error', err.message))
redisClient.on('connect', () => console.log('📦 Redis Client Connected'))
redisClient.on('ready', () => console.log('📦 Redis Client Ready'))
redisClient.on('end', () => console.log('📦 Redis Client Disconnected'))

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
}

export const getCache = async (key: string): Promise<string | null> => {
  return await redisClient.get(key)
}

export const setCache = async (key: string, value: string, ttl: number = 300): Promise<void> => {
  await redisClient.setEx(key, ttl, value)
}

export const deleteCache = async (key: string): Promise<void> => {
  await redisClient.del(key)
}

export const deleteCachePattern = async (pattern: string): Promise<void> => {
  const keys = await redisClient.keys(pattern)
  if (keys.length > 0) {
    await redisClient.del(keys)
  }
}

export const publishNotification = async (organizationId: string, event: string, data: any): Promise<void> => {
  try {
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
