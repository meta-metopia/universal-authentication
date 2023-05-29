import { PasswordlessServerService } from "@/services/Passwordless.service.server";

export const runtime = "edge";

export async function POST(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const domain: any = origin.replace(/^https?:\/\//, "");
  const userId: any = searchParams.get("userId");
  const type: any = searchParams.get("type");

  return PasswordlessServerService.getChallenge({
    type,
    userId,
    domain,
  });
}
