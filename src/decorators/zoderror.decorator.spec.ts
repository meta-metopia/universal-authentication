/**
 * @jest-environment node
 */

import { CatchZodError } from "./zoderror.decorator";
import { ZodError } from "zod";

describe("CatchZodError", () => {
  it("should catch ZodError and return a 400 response", async () => {
    // Arrange
    const target = {};
    const propertyKey = "testMethod";
    const descriptor = {
      value: async () => {
        throw new ZodError([
          {
            message: "Invalid input",
            code: "invalid_type",
            path: ["name"],
            expected: "string",
            received: "number",
          },
        ]);
      },
    };

    // Act
    const decoratedMethod = CatchZodError()(target, propertyKey, descriptor);
    const result = await decoratedMethod.value();

    // Assert
    expect(result.status).toBe(400);
    const body = await result.json();
    expect(body.error).toHaveLength(1);
    expect(body.method).toBe(propertyKey);
  });
});
