import { Config } from "@/config";
import { redis } from "@/db/redis";
import { CatchZodError } from "@/decorators/zoderror.decorator";
import { ValidateParams } from "@/decorators/zodparam.decorator";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { v1 } from "uuid";
import { z } from "zod";
import {
  DatabaseService,
  DatabaseServiceInterface,
} from "./Database.service.server";
import { KeySchema, KvService } from "./Kv.service.server";
import { WebauthnService } from "./Webauthn.service.server";

const PostSignupParams = z.object({
  username: z.string(),
  credential: z.object({
    id: z.string(),
    publicKey: z.string(),
    algorithm: z.enum(["RS256", "ES256"]),
  }),
  authenticatorData: z.string(),
  clientData: z.string(),
  domain: z.string(),
});

export class PasswordlessServerService {
  constructor(
    private readonly databaseService: DatabaseServiceInterface = new DatabaseService(),
    private readonly webauthnService: WebauthnService = new WebauthnService()
  ) {}

  @CatchZodError()
  @ValidateParams(PostSignupParams)
  async signup(registration: z.infer<typeof PostSignupParams>) {
    const key = KvService.getKey({
      type: "registration",
      userId: registration.username,
      domain: registration.domain,
    });
    if (!redis.exists(key)) {
      return NextResponse.json(
        {
          error: "No registration session found",
          solution:
            "Make sure you have a valid registration session before calling this endpoint. You can try to call /api/challenge to get a valid registration session.",
        },
        { status: 400 }
      );
    }

    const storedSession = await redis.get(key);
    const sessionSchema = z.object({
      challenge: z.string({ description: "The challenge string" }),
    });
    let session: z.infer<typeof sessionSchema>;

    // If a session is found, the method attempts to parse the session data
    // using the sessionSchema object defined in the code block.
    // If the parsing fails, the method deletes the session from Redis and throws the error.
    try {
      session = sessionSchema.parse(storedSession);
    } catch (e) {
      await redis.del(key);
      throw e;
    }

    const registrationResult = await this.webauthnService.verifyRegistration(
      {
        username: registration.username,
        credential: registration.credential,
        authenticatorData: registration.authenticatorData,
        clientData: registration.clientData,
      },
      {
        challenge: session.challenge,
        origin: registration.domain,
      }
    );

    const createdUser = await this.databaseService.addUser({
      domain: registration.domain,
      username: registration.username,
      credential: {
        id: registrationResult.credential.id,
        publicKey: registrationResult.credential.publicKey,
        algorithm: registrationResult.credential.algorithm,
      },
      authenticatorData: registration.authenticatorData,
      clientData: registration.clientData,
    });

    return {
      id: createdUser.id,
    };
  }
}
