import {
  AuthenticationInterface,
  OnSignInSchema,
  OnSignUpSchema,
} from "./types";
import { z } from "zod";
import { ValidateParams } from "utils";
import { client } from "@passwordless-id/webauthn";
import axios from "axios";
import { on } from "events";

const SignInParamsSchema = z.object({
  username: z.string(),
  getCredentialId: z.function(
    z.tuple([z.string()]),
    z.promise(
      z.object({
        credentialId: z.string(),
        error: z.string().optional(),
      })
    )
  ),
  challenge: z.function(
    z.tuple([z.string()]),
    z.promise(
      z.object({
        challenge: z.string(),
        error: z.string().optional(),
      })
    )
  ),
  onSendSignIn: z.function(
    z.tuple([
      z.object({
        credential: z.object({
          credentialId: z.string(),
          authenticatorData: z.string(),
          clientData: z.string(),
          signature: z.string(),
        }),
        challenge: z.string(),
      }),
    ]),
    z.promise(
      z.object({
        session: z.object({
          id: z.string(),
        }),
        error: z.string().optional(),
      })
    )
  ),
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
  authenticatorType: z
    .enum(["auto", "local", "extern", "roaming", "both"])
    .optional(),
  userVerification: z.enum(["discouraged", "preferred", "required"]).optional(),
});

type SignupResponse = z.infer<typeof SignupResponseSchema>;

export class WebAuthnAuthentication implements AuthenticationInterface {
  @ValidateParams([SignInParamsSchema, OnSignInSchema])
  async signIn(
    {
      username,
      getCredentialId,
      onSendSignIn,
      challenge,
    }: z.infer<typeof SignInParamsSchema>,
    onSignIn: (args_0: {
      message: string;
      status: "error" | "progress" | "success";
      error?: string | undefined;
    }) => Promise<void>
  ): Promise<{ sessionId: string }> {
    await onSignIn({
      message: "start-getting-credential-id",
      status: "progress",
    });

    const credentialIdResponse = await getCredentialId(username);
    if (credentialIdResponse.error) {
      await onSignIn({
        message: "error-getting-credential-id",
        status: "error",
        error: `${credentialIdResponse.error}`,
      });
      throw credentialIdResponse.error;
    }

    await onSignIn({
      message: "end-getting-credential-id",
      status: "progress",
    });

    await onSignIn({
      message: "start-generating-challenge-request",
      status: "progress",
    });
    const challengeResponse = await challenge(username);
    if (challengeResponse.error) {
      await onSignIn({
        message: "error-generating-challenge",
        status: "error",
        error: `${challengeResponse.error}`,
      });
      throw challengeResponse.error;
    }

    await onSignIn({
      message: "end-generating-challenge-request",
      status: "progress",
    });

    await onSignIn({
      message: "start-client-side-signing",
      status: "progress",
    });

    const credentialResponse = await this.authenticate({
      challenge: challengeResponse.challenge,
      id: credentialIdResponse.credentialId,
    });
    if (credentialResponse.error) {
      await onSignIn({
        message: "error-client-side-signing",
        status: "error",
        error: `${credentialResponse.error}`,
      });
      throw credentialResponse.error;
    }
    await onSignIn({
      message: "end-client-side-signing",
      status: "progress",
    });

    await onSignIn({
      message: "start-sending-sign-in-request",
      status: "progress",
    });

    const sessionResponse = await onSendSignIn({
      credential: credentialResponse.authentication!,
      challenge: challengeResponse.challenge,
    });
    if (sessionResponse.error) {
      await onSignIn({
        message: "error-sending-sign-in-request",
        status: "error",
        error: `${sessionResponse.error}`,
      });
      throw sessionResponse.error;
    }

    await onSignIn({
      message: "end-sending-sign-in-request",
      status: "progress",
    });
    return {
      sessionId: sessionResponse.session.id,
    };
  }

  @ValidateParams([SignupParamsSchema, OnSignUpSchema])
  async signUp(
    {
      username,
      challenge,
      onSendSignUp,
      authenticatorType,
      userVerification,
    }: z.infer<typeof SignupParamsSchema>,
    onSignUp: (args_0: {
      status: "error" | "progress" | "success";
      message: string;
      error?: string | undefined;
    }) => Promise<void>
  ): Promise<{ id: string }> {
    await onSignUp({
      message: "start-generating-challenge-request",
      status: "progress",
    });
    const challengeString = await challenge(username);
    await onSignUp({
      message: `end-generating-challenge-request`,
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
      authenticatorType,
      userVerification,
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
      ...registration,
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
    authenticatorType,
    userVerification,
  }: {
    challenge: string;
    username: string;
    authenticatorType?: any;
    userVerification?: "discouraged" | "preferred" | "required";
  }) {
    console.log("Authenticator Type", authenticatorType);
    try {
      const registration = await client.register(username, challenge, {
        userVerification,
        authenticatorType,
      });
      return { registration, error: null };
    } catch (err) {
      return { registration: null, error: err };
    }
  }

  private async authenticate({
    challenge,
    id,
  }: {
    challenge: string;
    id: string;
  }) {
    try {
      const authentication = await client.authenticate([id], challenge);
      return { authentication, error: null };
    } catch (err) {
      return { authentication: null, error: err };
    }
  }
}
