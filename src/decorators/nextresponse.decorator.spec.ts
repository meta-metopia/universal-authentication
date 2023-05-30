/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";
import { Post } from "./nextresponse.decorator";

describe("Post", () => {
  it("should return a NextResponse object with status 201", async () => {
    class TestClass {
      @Post()
      async testMethod() {
        return { message: "success" };
      }
    }
    const instance = new TestClass();
    const result: any = await instance.testMethod();
    expect(result.status).toBe(201);
  });
  it("should return the original result if it is already a NextResponse object", async () => {
    class TestClass {
      @Post()
      async testMethod() {
        return NextResponse.json({ message: "success" }, { status: 200 });
      }
    }
    const instance = new TestClass();
    const result = await instance.testMethod();
    expect(result).toBeInstanceOf(NextResponse);
    expect(result.status).toBe(200);
  });
});
