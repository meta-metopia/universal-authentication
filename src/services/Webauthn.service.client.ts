import { ValidateParams } from "utils";
import { z } from "zod";
import axios from "axios";

export class WebauthnClientService {
  static sendSignUp(username: string) {
    throw new Error("Method not implemented.");
  }
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

  static async register(data: any) {
    try {
      console.log("data", data);
      const response = await axios.post("/api/auth/signup", data);
      return {
        id: response.data.id,
      };
    } catch (err) {
      return {
        id: "",
        error: `Error: ${err}`,
      };
    }
  }
}
