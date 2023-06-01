import { AuthenticationController } from "@/controllers/Authentication.controller";

export async function POST(request: Request) {
  return AuthenticationController.signIn(request);
}
