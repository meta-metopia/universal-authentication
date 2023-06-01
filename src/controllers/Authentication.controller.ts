import { Get, Post } from "@/decorators/nextresponse.decorator";
import { PasswordlessServerService } from "@/services/Passwordless.service.server";
import { SessionService } from "@/services/Session.service.server";
import { cookies } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

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

  @Get()
  static async signIn(request: Request) {
    const { origin } = new URL(request.url);
    const domain: any = origin;
    const body = await request.json();

    const param = {
      ...body,
      domain,
    };

    const response = await new PasswordlessServerService().signin(param);
    if ("sessionId" in response) cookies().set("session", response.sessionId);
    return response;
  }
}
