import { z } from "zod";
import { KeySchema, KvService } from "./Kv.service.server";
import { redis } from "@/db/redis";
import dayjs from "dayjs";
import { v1 } from "uuid";
import { Config } from "@/config";
import { CatchZodError } from "@/decorators/zoderror.decorator";
import { NextResponse } from "next/server";

const GetChallengeParamsSchema = z.object({
  type: KeySchema,
  userId: z.string(),
  domain: z.string(),
});

const GetChallengeResponseSchema = z.object({
  challenge: z.string(),
  expiresAt: z.union([z.date(), z.string()]),
});

export class PasswordlessServerService {
  @CatchZodError()
  static async getChallenge(params: z.infer<typeof GetChallengeParamsSchema>) {
    const { type, userId, domain } = GetChallengeParamsSchema.parse(params);

    const key = KvService.getKey({
      type,
      userId,
      domain,
    });

    if (await redis.exists(key)) {
      const data = await redis.get(key);
      return NextResponse.json(GetChallengeResponseSchema.parse(data));
    }

    const challenge = v1();
    const expiresAt = dayjs()
      .add(Config.defaultChallengeExpiration, "second")
      .toDate();
    const response = GetChallengeResponseSchema.parse({ challenge, expiresAt });
    await redis.set(key, JSON.stringify(response));
    await redis.expire(key, Config.defaultChallengeExpiration);

    return NextResponse.json(response);
  }
}
