import { Post } from "@/decorators/nextresponse.decorator";
import { PasswordlessServerService } from "@/services/Passwordless.service.server";

export class AuthenticationController {
  @Post()
  static async signUp(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const domain: any = origin.replace(/^https?:\/\//, "");
    const body = await request.json();

    return new PasswordlessServerService().signup({
      ...body,
      domain,
    });
  }
}
