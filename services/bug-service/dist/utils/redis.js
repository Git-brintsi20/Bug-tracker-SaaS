"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishNotification = exports.deleteCachePattern = exports.deleteCache = exports.setCache = exports.getCache = exports.connectRedis = void 0;
const redis_1 = require("redis");
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const isProduction = redisUrl.startsWith('rediss://');
const redisClient = (0, redis_1.createClient)({
    url: redisUrl,
    pingInterval: 1000,
    socket: {
        tls: isProduction,
        rejectUnauthorized: false,
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
            const delay = Math.min(retries * 100, 3000);
            console.log(`Redis connection lost. Retrying in ${delay}ms...`);
            return delay;
        },
    },
});
let redisReady = false;
redisClient.on('error', (err) => {
    redisReady = false;
    console.error('Redis Client Error', err.message);
});
redisClient.on('ready', () => {
    redisReady = true;
    console.log('📦 Redis Client Ready');
});
redisClient.on('end', () => {
    redisReady = false;
    console.log('📦 Redis Client Disconnected');
});
// Non-blocking connect — never throws, just logs
const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    }
    catch (err) {
        console.error('Redis initial connect failed (will retry in background):', err.message);
    }
};
exports.connectRedis = connectRedis;
// All cache operations are fail-safe: errors return null / no-op
const getCache = async (key) => {
    try {
        if (!redisReady)
            return null;
        return await redisClient.get(key);
    }
    catch {
        return null;
    }
};
exports.getCache = getCache;
const setCache = async (key, value, ttl = 300) => {
    try {
        if (!redisReady)
            return;
        await redisClient.setEx(key, ttl, value);
    }
    catch { /* ignore */ }
};
exports.setCache = setCache;
const deleteCache = async (key) => {
    try {
        if (!redisReady)
            return;
        await redisClient.del(key);
    }
    catch { /* ignore */ }
};
exports.deleteCache = deleteCache;
const deleteCachePattern = async (pattern) => {
    try {
        if (!redisReady)
            return;
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    }
    catch { /* ignore */ }
};
exports.deleteCachePattern = deleteCachePattern;
const publishNotification = async (organizationId, event, data) => {
    try {
        if (!redisReady)
            return;
        await redisClient.publish('notifications', JSON.stringify({
            organizationId,
            event,
            data,
        }));
    }
    catch (error) {
        console.error('Error publishing notification:', error);
    }
};
exports.publishNotification = publishNotification;
exports.default = redisClient;
