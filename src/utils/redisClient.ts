import Redis from 'ioredis';
import { logger } from './logger.js';

const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`;
export const redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy(times: number) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});
redisClient.on('connect', () => {
    logger.info('Redis client connected');
});

redisClient.on('error', (err: Error) => {
    logger.error({ err }, 'Redis client error');
});

const serialize = (value: unknown) => JSON.stringify(value);
const deserialize = <T>(payload: string): T => JSON.parse(payload) as T;

export const cacheUtils = {
    get: async <T>(key: string): Promise<T | null> => {
        const data = await redisClient.get(key);
        return data ? deserialize<T>(data) : null;
    },
    set: async <T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> => {
        await redisClient.set(key, serialize(value), 'EX', ttlSeconds);
    },
    del: async (key: string): Promise<void> => {
        if (!key) return;
        await redisClient.del(key);
    },
    deleteByPrefix: async (prefix: string): Promise<void> => {
        if (!prefix) return;
        const keys = await redisClient.keys(`${prefix}*`);
        if (keys.length) {
            await redisClient.del(...keys);
        }
    },
};
