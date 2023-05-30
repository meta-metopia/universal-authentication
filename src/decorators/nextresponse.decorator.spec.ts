/**
 * @jest-environment node
 */

import { NextResponse } from "next/server";
import { Get, Post } from "./nextresponse.decorator";

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
    const body = await result.json();
    expect(body.message).toBe("success");
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
    const body = await result.json();
    expect(body.message).toBe("success");
  });
  it("should return an empty object if original method returns nothing", async () => {
    class TestClass {
      @Post()
      async testMethod() {}
    }
    const instance = new TestClass();
    const result = await instance.testMethod();
    expect(result).toBeInstanceOf(NextResponse);
    expect((result as any).status).toBe(200);
  });
});

describe("Get", () => {
  it("should return a NextResponse object with status 201", async () => {
    class TestClass {
      @Get()
      async testMethod() {
        return { message: "success" };
      }
    }
    const instance = new TestClass();
    const result: any = await instance.testMethod();
    expect(result.status).toBe(200);
    const body = await result.json();
    expect(body.message).toBe("success");
  });
  it("should return the original result if it is already a NextResponse object", async () => {
    class TestClass {
      @Get()
      async testMethod() {
        return NextResponse.json({ message: "success" }, { status: 200 });
      }
    }
    const instance = new TestClass();
    const result = await instance.testMethod();
    expect(result).toBeInstanceOf(NextResponse);
    expect(result.status).toBe(200);
    const body = await result.json();
    expect(body.message).toBe("success");
  });

  it("should return an empty object if original method returns nothing", async () => {
    class TestClass {
      @Get()
      async testMethod() {}
    }
    const instance = new TestClass();
    const result = await instance.testMethod();
    expect(result).toBeInstanceOf(NextResponse);
    expect((result as any).status).toBe(200);
  });
});
