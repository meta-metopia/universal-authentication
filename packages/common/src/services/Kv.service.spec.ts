import { KvService } from "./Kv.service.server";

jest.mock("../db/redis");

describe("KvService", () => {
  beforeEach(() => {});

  describe("getKey", () => {
    it("should return the correct key", () => {
      const expectedKey = "https://example.com:registration:123";
      const actualKey = KvService.getKey({
        type: "registration",
        userId: "123",
        domain: "https://example.com",
      });
      expect(actualKey).toBe(expectedKey);
    });
  });
});
