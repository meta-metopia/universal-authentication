import { z } from "zod";
import { KeySchema, KvService } from "./Kv.service.server";
import { redis } from "@/db/redis";
import dayjs from "dayjs";
import { v1 } from "uuid";
import { Config } from "@/config";
import { CatchZodError } from "@/decorators/zoderror.decorator";
import { NextResponse } from "next/server";
import { ValidateParams } from "@/decorators/zodparam.decorator";
import { server } from "@passwordless-id/webauthn";
import { prisma } from "@/db/prisma";

const GetChallengeParamsSchema = z.object({
  type: KeySchema,
  userId: z.string(),
  domain: z.string(),
});

const GetChallengeResponseSchema = z.object({
  challenge: z.string(),
  expiresAt: z.union([z.date(), z.string()]),
});

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
  @CatchZodError()
  @ValidateParams(GetChallengeParamsSchema)
  static async getChallenge({
    type,
    userId,
    domain,
  }: z.infer<typeof GetChallengeParamsSchema>) {
    const key = KvService.getKey({
      type,
      userId,
      domain,
    });

    if (await redis.exists(key)) {
      const data = await redis.get(key);
      return GetChallengeResponseSchema.parse(data);
    }

    const challenge = v1();
    const expiresAt = dayjs()
      .add(Config.defaultChallengeExpiration, "second")
      .toDate();
    const response = GetChallengeResponseSchema.parse({ challenge, expiresAt });
    await redis.set(key, JSON.stringify(response));
    await redis.expire(key, Config.defaultChallengeExpiration);

    return response;
  }

  @CatchZodError()
  @ValidateParams(PostSignupParams)
  static async signup(registration: z.infer<typeof PostSignupParams>) {
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

    const registrationResult = await server.verifyRegistration(
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

    const createdUser = await prisma.user.create({
      data: {
        username: registration.username,
        domain: {
          connect: {
            name: registration.domain,
          },
        },
        Credential: {
          create: {
            id: registrationResult.credential.id,
            publicKey: registrationResult.credential.publicKey,
            algorithm: registrationResult.credential.algorithm,
          },
        },
      },
    });

    return {
      id: createdUser.id,
    };
  }
}
