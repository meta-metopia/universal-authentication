/**
 * @jest-environment node
 */
import { redis } from "@/db/redis";
import { ChallengeService } from "./Challenge.service.server";

jest.mock("../db/redis");

describe("ChallengeService", () => {
  let challengeService: ChallengeService;

  beforeEach(() => {
    challengeService = new ChallengeService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getChallenge", () => {
    it("should return a challenge and expiration date", async () => {
      const result = await challengeService.getChallenge({
        type: "registration",
        userId: "someUserId",
        domain: "someDomain",
      });

      expect(result).toHaveProperty("challenge");
      expect(result).toHaveProperty("expiresAt");
    });

    it("should return the same challenge and expiration date for the same input", async () => {
      const input: any = {
        type: "registration",
        userId: "someUserId",
        domain: "someDomain",
      };

      const result1 = await challengeService.getChallenge(input);

      jest.spyOn(redis, "exists").mockResolvedValue(1);
      jest.spyOn(redis, "get").mockResolvedValue(result1);
      const result2 = await challengeService.getChallenge(input);

      expect(result1).toEqual(result2);
    });

    it("should return a different challenge and expiration date for different input", async () => {
      const input: any = {
        type: "registration",
        userId: "someUserId",
        domain: "someDomain",
      };

      const input2: any = {
        type: "registration",
        userId: "someUserId2",
        domain: "someDomain2",
      };

      const result1 = await challengeService.getChallenge(input);

      // sleep for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result2 = await challengeService.getChallenge(input2);

      expect(result1.expiresAt !== result2.expiresAt).toBeTruthy();
    });
  });
});
