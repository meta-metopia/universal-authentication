/**
 * @jest-environment node
 */
import { KvService } from "service";
import { ChallengeService } from "./Challenge.service.server";

describe("ChallengeService", () => {
  let challengeService: ChallengeService;
  let kvService: KvService;

  beforeEach(() => {
    kvService = new KvService();
    challengeService = new ChallengeService(kvService);
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

      jest.spyOn(kvService, "exists").mockResolvedValue(1);
      jest.spyOn(kvService, "get").mockResolvedValue(result1);
      const result2 = await challengeService.getChallenge(input);

      expect(result1.challenge).toBe(result2.challenge);
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
