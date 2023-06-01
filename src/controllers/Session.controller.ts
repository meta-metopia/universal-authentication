import { Get } from "@/decorators/nextresponse.decorator";
import { SessionService } from "@/services/Session.service.server";
import { cookies } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

export class SessionController {
  @Get()
  static async isSignedIn(request: Request) {
    const sessionId = cookies().get("session");
    if (!sessionId) {
      return NextResponse.json(
        {
          error: "No session found",
          solution:
            "Make sure you have a valid session before calling this endpoint. You can try to call /api/signin to get a valid session.",
        },
        { status: 401 }
      );
    }

    const isSignedIn = await new SessionService().isSignedIn(sessionId.value);

    if (!isSignedIn) {
      return NextResponse.json(
        {
          error: "Session is not valid",
          solution:
            "Make sure you have a valid session before calling this endpoint. You can try to call /api/signin to get a valid session.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Session is valid",
      },
      { status: 200 }
    );
  }

  @Get()
  static async signOut(request: Request) {
    const sessionId = cookies().get("session");
    if (!sessionId) {
      return NextResponse.json(
        {
          error: "No session found",
          solution:
            "Make sure you have a valid session before calling this endpoint. You can try to call /api/signin to get a valid session.",
        },
        { status: 401 }
      );
    }

    await new SessionService().signout(sessionId.value);
    cookies().delete("session");
    return {
      message: "Session is deleted",
    };
  }
}
