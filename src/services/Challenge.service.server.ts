import { Config } from "@/config";
import { CatchZodError } from "@/decorators/zoderror.decorator";
import { KvServiceInterface, ValidateParams } from "common";
import dayjs from "dayjs";
import { v1 } from "uuid";
import { z } from "zod";
import { KeySchema, KvService } from "common";

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
  constructor(
    private readonly kvService: KvServiceInterface = new KvService()
  ) {}

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

    const exists = await this.kvService.exists(key);
    if (await this.kvService.exists(key)) {
      const data = await this.kvService.get(key);
      return GetChallengeResponseSchema.parse(data);
    }

    const challenge = v1();
    const expiresAt = dayjs()
      .add(Config.defaultChallengeExpiration, "second")
      .toDate();
    const response = GetChallengeResponseSchema.parse({ challenge, expiresAt });
    await this.kvService.set(key, JSON.stringify(response));
    await this.kvService.expire(key, Config.defaultChallengeExpiration);

    return response;
  }
}
