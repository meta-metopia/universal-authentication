import { Post } from "@/decorators/nextresponse.decorator";
import { PasswordlessServerService } from "@/services/Passwordless.service.server";

export class ChallengeController {
  @Post()
  static createChallenge(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const domain: any = origin.replace(/^https?:\/\//, "");
    const userId: any = searchParams.get("userId");
    const type: any = searchParams.get("type");

    return new PasswordlessServerService().getChallenge({
      type,
      userId,
      domain,
    });
  }
}
