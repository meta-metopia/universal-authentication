import { z } from "zod";

export function ValidateParams(
  schema: z.AnyZodObject | z.AnyZodObject[] | any[]
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (Array.isArray(schema)) {
        schema.forEach((item, index) => {
          item.parse(args[index]);
        });
      } else {
        schema.array().parse(args);
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
