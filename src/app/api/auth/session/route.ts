import { SessionController } from "@/controllers/Session.controller";

export const runtime = "edge";

export async function GET(request: Request) {
  return SessionController.isSignedIn(request);
}
