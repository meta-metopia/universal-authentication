import { AuthenticationInterface, OnSignUpSchema } from "./types";
import { z } from "zod";
import { ValidateParams } from "utils";
import { client } from "@passwordless-id/webauthn";

const CredentialSchema = z.object({
  id: z.string(),
  publicKey: z.string(),
  algorithm: z.enum(["RS256", "ES256"]),
});

const SignupResponseSchema = z.object({
  id: z.string(),
});

const SignupParamsSchema = z.object({
  username: z.string(),
  challenge: z.function(
    z.tuple([z.string()]),
    z.promise(
      z.object({
        challenge: z.string(),
        error: z.string().optional(),
      })
    )
  ),
  /**
   * Send the sign up request to the server
   */
  onSendSignUp: z.function(
    z.tuple([z.any()]),
    z.promise(
      z.object({
        id: z.string(),
        error: z.string().optional(),
      })
    )
  ),
});

type SignupResponse = z.infer<typeof SignupResponseSchema>;

export class WebAuthnAuthentication implements AuthenticationInterface {
  @ValidateParams([SignupParamsSchema, OnSignUpSchema])
  async signUp(
    { username, challenge, onSendSignUp }: z.infer<typeof SignupParamsSchema>,
    onSignUp: (args_0: {
      status: "error" | "progress" | "success";
      message: string;
      error?: string | undefined;
    }) => Promise<void>
  ): Promise<{ id: string }> {
    await onSignUp({
      message: "start-generating-challenge",
      status: "progress",
    });
    const challengeString = await challenge(username);
    await onSignUp({
      message: `end-generating-challenge`,
      status: "progress",
    });

    if (challengeString.error) {
      await onSignUp({
        message: "error-generating-challenge",
        status: "error",
        error: `${challengeString.error}`,
      });
      throw challengeString.error;
    }

    await onSignUp({
      message: "start-client-side-registering",
      status: "progress",
    });
    const { registration, error } = await this.register({
      challenge: challengeString.challenge,
      username,
    });

    if (error) {
      await onSignUp({
        message: "error-client-side-registering",
        status: "error",
        error: `${error}`,
      });
      throw error;
    }

    await onSignUp({
      message: "end-client-side-registering",
      status: "progress",
    });

    await onSignUp({
      message: "start-sending-sign-up-request",
      status: "progress",
    });
    const response = await onSendSignUp({
      credential: registration!.credential,
      username,
    });
    if (response.error) {
      await onSignUp({
        message: "error-sending-sign-up-request",
        status: "error",
        error: `${response.error}`,
      });
      throw response.error;
    }

    await onSignUp({
      message: "end-sending-sign-up-request",
      status: "progress",
    });

    return {
      id: response.id,
    };
  }

  private async register({
    challenge,
    username,
  }: {
    challenge: string;
    username: string;
  }) {
    try {
      const registration = await client.register(username, challenge);
      return { registration, error: null };
    } catch (err) {
      return { registration: null, error: err };
    }
  }
}
