import { SessionController } from "@/controllers/Session.controller";

export const runtime = "edge";

export async function POST(request: Request) {
  return SessionController.signOut(request);
}
