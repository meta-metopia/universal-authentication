import { ZodError } from "zod";
import { NextResponse } from "next/server";

export function CatchZodError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof ZodError) {
          return NextResponse.json(
            { error: error.issues, method: propertyKey },
            { status: 400 }
          );
        }
        throw error;
      }
    };

    return descriptor;
  };
}
