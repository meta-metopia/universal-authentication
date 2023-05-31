import { z } from "zod";

export const OnSignUpSchema = z.function(
  z.tuple([z.string().optional(), z.string().optional()]),
  z.promise(z.void())
);

export interface AuthenticationInterface {
  signUp(
    data: any,
    onSignUp: z.infer<typeof OnSignUpSchema>
  ): Promise<{ id: string }>;
}
