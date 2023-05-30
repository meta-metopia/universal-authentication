import { AuthenticationController } from "@/controllers/Authentication.controller";

// temporary disable edge runtime since we are using prisma client and it is not compatible with edge runtime
// export const runtime = "edge";

export async function POST(request: Request) {
  return AuthenticationController.signUp(request);
}
