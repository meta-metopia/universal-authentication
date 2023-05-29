import { z } from "zod";

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

/**
 * A class representing a key-value store service.
 * This class provides methods for interacting with a key-value store.
 */
export class KvService {
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
}
