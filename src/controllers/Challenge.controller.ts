import { Post } from "@/decorators/nextresponse.decorator";
import { ChallengeService } from "@/services/Challenge.service.server";

export class ChallengeController {
  @Post()
  static createChallenge(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const domain: any = origin;
    const userId: any = searchParams.get("userId");
    const type: any = searchParams.get("type");

    return new ChallengeService().getChallenge({
      type,
      userId,
      domain,
    });
  }
}
