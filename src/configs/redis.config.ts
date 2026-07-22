import Redis from "ioredis";
import { ENV } from "../shares/constants/environment";

let redis: Redis | null = null;

export const getRedis = (): Redis => {
    if (!redis) {
        redis = new Redis(ENV.REDIS_URL, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                if (times > 5) return null;
                return Math.min(times * 200, 3000);
            },
            lazyConnect: true,
        });
    }
    return redis;
};

export const connectRedis = async () => {
    try {
        const client = getRedis();
        await client.connect();
        console.log(`Redis connected: ${ENV.REDIS_URL}`);
    } catch (err) {
        console.warn("Redis connection failed, cache disabled:", (err as Error).message);
    }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await getRedis().get(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

export const setCache = async (key: string, data: unknown, ttlSeconds: number): Promise<void> => {
    try {
        await getRedis().setex(key, ttlSeconds, JSON.stringify(data));
    } catch {
    }
};

export const delCache = async (...keys: string[]): Promise<void> => {
    if (keys.length === 0) return;
    try {
        await getRedis().del(...keys);
    } catch {
    }
};

export const delCacheByPattern = async (pattern: string): Promise<void> => {
    try {
        const client = getRedis();
        let cursor = "0";
        do {
            const [nextCursor, matched] = await client.scan(cursor, "MATCH", pattern, "COUNT", 50);
            cursor = nextCursor;
            if (matched.length > 0) {
                await client.del(...matched);
            }
        } while (cursor !== "0");
    } catch {
    }
};
