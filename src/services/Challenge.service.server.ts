import { Config } from "@/config";
import { redis } from "@/db/redis";
import { CatchZodError } from "@/decorators/zoderror.decorator";
import { ValidateParams } from "@/decorators/zodparam.decorator";
import dayjs from "dayjs";
import { v1 } from "uuid";
import { z } from "zod";
import { KeySchema, KvService } from "./Kv.service.server";

const GetChallengeParamsSchema = z.object({
  type: KeySchema,
  userId: z.string(),
  domain: z.string(),
});

const GetChallengeResponseSchema = z.object({
  challenge: z.string(),
  expiresAt: z.union([z.date(), z.string()]),
});

export class ChallengeService {
  @CatchZodError()
  @ValidateParams(GetChallengeParamsSchema)
  async getChallenge({
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
}
