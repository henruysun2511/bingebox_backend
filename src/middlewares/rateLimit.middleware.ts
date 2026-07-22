import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedis } from "../configs/redis.config";

const createRedisStore = () => {
    const client = getRedis();
    if (client.status !== "ready") return undefined;
    return new RedisStore({
        sendCommand: (...args: string[]) => client.call(args[0], ...args.slice(1)) as any,
        prefix: "rl:",
    });
};

let store: ReturnType<typeof createRedisStore>;

const getStore = () => {
    if (!store) store = createRedisStore();
    return store;
};

export const createRateLimiter = (windowMs: number, max: number, message?: string) =>
    rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            messages: [message || "Quá nhiều yêu cầu, vui lòng thử lại sau"],
        },
        standardHeaders: true,
        legacyHeaders: false,
        store: getStore(),
        keyGenerator: (req) => {
            return req.ip || req.socket.remoteAddress || "unknown";
        },
    });
