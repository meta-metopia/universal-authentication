import { z } from "zod";
import { redis } from "../db/redis";

export const KeySchema = z.enum([
  "authentication",
  "registration",
  "authenticated",
]);
const GetKeyParamsSchema = z.object({
  /**
   * Key type
   */
  type: KeySchema,
  /**
   * User ID
   */
  userId: z.string(),
  /**
   * Domain
   */
  domain: z.string().url(),
});

export interface KvServiceInterface {
  get(key: string): Promise<unknown>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
}

/**
 * A class representing a key-value store service.
 * This class provides methods for interacting with a key-value store.
 */
export class KvService implements KvServiceInterface {
  /**
   * Returns a string representing the key for a given user, domain and key type.
   * @param type - The type of key to retrieve.
   * @param userId - The ID of the user associated with the key.
   * @param domain - The domain associated with the key.
   * @returns A string representing the key.
   */
  static getKey({ type, userId, domain }: z.infer<typeof GetKeyParamsSchema>) {
    return `${domain}:${type}:${userId}`;
  }

  async get(key: string) {
    return redis.get(key);
  }

  async set(key: string, value: string) {
    await redis.set(key, value);
  }

  async delete(key: string) {
    await redis.del(key);
  }

  async exists(key: string) {
    return redis.exists(key);
  }

  async expire(key: string, seconds: number) {
    await redis.expire(key, seconds);
  }
}
