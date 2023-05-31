import { ValidateParams } from "utils";
import { z } from "zod";
import axios from "axios";

export class WebauthnClientService {
  @ValidateParams([z.string()])
  static async getChallenge(username: string) {
    try {
      const response = await axios.post(
        "/api/auth/challenge?type=registration&userId=" + username
      );

      const result = z
        .object({
          challenge: z.string(),
          expiresAt: z.union([z.date(), z.string()]),
        })
        .parse(response.data);
      return {
        challenge: result.challenge,
      };
    } catch (error) {
      return {
        error: `Error: ${error}`,
        challenge: "",
      };
    }
  }

  static async register(username: string, credential: any) {
    const response = await axios.post("/api/auth/register", {
      username,
      credential,
    });

    return z
      .object({
        id: z.string(),
        error: z.string().optional(),
      })
      .parse(response.data);
  }
}
