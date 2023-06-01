import { CatchZodError } from "@/decorators/zoderror.decorator";
import { KvService } from "service";
import { ValidateParams } from "utils";
import { z } from "zod";

export class SessionService {
  constructor(private readonly kvService: KvService = new KvService()) {}

  @CatchZodError()
  @ValidateParams(z.string())
  async isSignedIn(sessionId: string) {
    const session = await this.kvService.get(sessionId);
    if (!session) {
      return false;
    }

    return true;
  }

  @CatchZodError()
  @ValidateParams(z.string())
  async signout(sessionId: string) {
    await this.kvService.del(sessionId);
  }
}
