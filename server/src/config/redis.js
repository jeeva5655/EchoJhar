const redis = require('redis');

let redisClient = null;

/**
 * Redis Cache Configuration
 * Business Use Cases:
 * - Session management (user tokens)
 * - API response caching (reduce DB load)
 * - Rate limiting (prevent abuse)
 * - Real-time analytics aggregation
 */
const connectRedis = async () => {
    try {
        redisClient = redis.createClient({
            url: process.env.REDIS_URL,
            password: process.env.REDIS_PASSWORD || undefined,
            socket: {
                reconnectStrategy: (retries) => {
                    // Exponential backoff for reconnection
                    if (retries > 10) {
                        console.error('❌ Redis: Max reconnection attempts reached');
                        return new Error('Redis unavailable');
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        redisClient.on('error', (err) => {
            console.error('Redis Error:', err.message);
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis Connected');
        });

        redisClient.on('reconnecting', () => {
            console.log('🔄 Redis Reconnecting...');
        });

        await redisClient.connect();

        // Test connection with business metric
        await redisClient.set('server:startup', new Date().toISOString(), {
            EX: 3600 // Expire in 1 hour
        });

        return redisClient;
    } catch (error) {
        console.error('❌ Redis Connection Failed:', error.message);
        console.log('⚠️  Running without cache - performance may be affected');
        return null; // Graceful degradation - app works without Redis
    }
};

/**
 * Business Logic: Cache Helper Functions
 */
const cacheHelpers = {
    // Cache API responses for performance
    async cacheResponse(key, data, ttl = 300) {
        if (!redisClient) return false;
        try {
            await redisClient.setEx(key, ttl, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Cache set error:', error.message);
            return false;
        }
    },

    async getCached(key) {
        if (!redisClient) return null;
        try {
            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache get error:', error.message);
            return null;
        }
    },

    async invalidate(pattern) {
        if (!redisClient) return false;
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
            return true;
        } catch (error) {
            console.error('Cache invalidation error:', error.message);
            return false;
        }
    },

    // Business metric: Increment counters (e.g., booking attempts)
    async incrementCounter(key, ttl = 3600) {
        if (!redisClient) return 0;
        try {
            const count = await redisClient.incr(key);
            if (count === 1) {
                await redisClient.expire(key, ttl);
            }
            return count;
        } catch (error) {
            console.error('Counter increment error:', error.message);
            return 0;
        }
    }
};

module.exports = { connectRedis, redisClient: () => redisClient, cacheHelpers };
