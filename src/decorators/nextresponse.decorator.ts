import { NextResponse } from "next/server";

export function Post() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      if (result instanceof NextResponse) {
        return result;
      }
      return NextResponse.json(result, { status: 201 });
    };
    return descriptor;
  };
}

export function Get() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);
      // if (result instanceof NextResponse) {
      //   return result;
      // }
      // return NextResponse.json(result, { status: 200 });
    };
    return descriptor;
  };
}
