import { z } from "zod";
import { ValidateParams } from "./zodparam.decorator";

describe("ValidateParams", () => {
  it("should validate single parameter", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });
    class TestClass {
      @ValidateParams(schema)
      testMethod(data: { name: string; age: number }) {
        return data;
      }
    }
    const instance = new TestClass();
    const result = instance.testMethod({ name: "John", age: 30 });
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should validate multiple parameters", () => {
    const schema1 = z.string();
    const schema2 = z.number();
    class TestClass {
      @ValidateParams([schema1, schema2])
      testMethod(name: string, age: number) {
        return { name, age };
      }
    }
    const instance = new TestClass();
    const result = instance.testMethod("John", 30);
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should throw error if validation fails", () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });
    class TestClass {
      @ValidateParams(schema)
      testMethod(data: any) {
        return data;
      }
    }
    const instance = new TestClass();
    expect(() => instance.testMethod({ name: "John" })).toThrow();
  });
});
