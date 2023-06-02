import { AuthenticationController } from "@/controllers/Authentication.controller";

export async function POST(request: Request) {
  return AuthenticationController.signIn(request);
}

export async function GET(request: Request) {
  return AuthenticationController.PrepareSignIn(request);
}
