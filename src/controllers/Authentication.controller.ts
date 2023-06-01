import { Post } from "@/decorators/nextresponse.decorator";
import { PasswordlessServerService } from "@/services/Passwordless.service.server";

export class AuthenticationController {
  @Post()
  static async signUp(request: Request) {
    const { origin } = new URL(request.url);
    const domain: any = origin;
    const body = await request.json();

    const param = {
      ...body,
      domain,
    };

    return new PasswordlessServerService().signup(param);
  }
}
