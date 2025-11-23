import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { cacheUtils } from './redisClient.js';
import { logger } from './logger.js';

type CacheMiddlewareOptions = {
    keyBuilder?: (req: Request) => string;
    enabled?: (req: Request) => boolean;
};

const buildCacheKey = (rawKey: string): string => (rawKey.startsWith('cache:') ? rawKey : `cache:${rawKey}`);

export const cacheMiddleware = <T = unknown>(duration: number, options: CacheMiddlewareOptions = {}): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET' || (options.enabled && !options.enabled(req))) {
            return next();
        }
        const rawKey = options.keyBuilder ? options.keyBuilder(req) : req.originalUrl || req.url;
        const key = buildCacheKey(rawKey);
        try {
            const cachedResponse = await cacheUtils.get<T>(key);
            if (cachedResponse) {
                res.setHeader('X-Cache', 'HIT');
                return res.json(cachedResponse);
            }
            res.setHeader('X-Cache', 'MISS');
            const originalJson = res.json.bind(res);
            res.json = (body: T): Response => {
                res.json = originalJson;
                cacheUtils.set<T>(key, body, duration).catch((err) => {
                    logger.error({ err, key }, 'Error caching response');
                });
                return originalJson(body);
            };
            return next();
        } catch (err) {
            logger.error({ err, key }, 'Redis cache error');
            return next();
        }
    };
};
