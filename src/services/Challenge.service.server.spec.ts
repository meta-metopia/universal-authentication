/**
 * @jest-environment node
 */
import { ChallengeService } from "./Challenge.service.server";

describe("ChallengeService", () => {
  let challengeService: ChallengeService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getChallenge", () => {
    it("should return a challenge and expiration date", async () => {
      const kvService = {
        exists: jest.fn().mockResolvedValue(0),
        set: jest.fn().mockResolvedValue(true),
        expire: jest.fn().mockResolvedValue(true),
      };
      challengeService = new ChallengeService(kvService as any);

      const result = await challengeService.getChallenge({
        type: "registration",
        userId: "someUserId",
        domain: "someDomain",
      });

      expect(result).toHaveProperty("challenge");
      expect(result).toHaveProperty("expiresAt");
    });

    it.skip("should return the same challenge and expiration date for the same input", async () => {
      const kvService = {
        exists: jest.fn().mockResolvedValue(0),
        set: jest.fn().mockResolvedValue(true),
        expire: jest.fn().mockResolvedValue(true),
      };
      challengeService = new ChallengeService(kvService as any);

      const input: any = {
        type: "registration",
        userId: "someUserId",
        domain: "someDomain",
      };

      const result1 = await challengeService.getChallenge(input);

      const result2 = await challengeService.getChallenge(input);

      expect(result1.challenge).toBe(result2.challenge);
    });

    it("should return a different challenge and expiration date for different input", async () => {
      const kvService = {
        exists: jest.fn().mockResolvedValue(0),
        set: jest.fn().mockResolvedValue(true),
        expire: jest.fn().mockResolvedValue(true),
      };
      challengeService = new ChallengeService(kvService as any);
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
