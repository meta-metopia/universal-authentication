import { Redis } from "@upstash/redis";
import { z } from "zod";

const globalRedis = global as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalRedis.redis ??
  new Redis({
    url: z.string({ description: "Redis URL" }).parse(process.env.REDIS_URL!),
    token: z
      .string({ description: "Redis token" })
      .parse(process.env.REDIS_TOKEN!),
  });

if (process.env.NODE_ENV !== "production") globalRedis.redis = redis;
