import { ChallengeController } from "@/controllers/Challenge.controller";

export const runtime = "edge";

export async function POST(request: Request) {
  return ChallengeController.createChallenge(request);
}
