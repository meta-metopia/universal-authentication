import { z } from "zod";

/**
 * @param {string} message - The message to display to the user
 * @param {string} error - The error message to display to the user
 * @param {string} status - The status of the sign up process
 */
export const OnSignUpSchema = z.function(
  z.tuple([
    z.object({
      message: z.string(),
      error: z.string().optional(),
      status: z.enum(["progress", "success", "error"]),
    }),
  ]),
  z.promise(z.void())
);

export type OnSignUp = z.infer<typeof OnSignUpSchema>;

export interface AuthenticationInterface {
  signUp(
    data: any,
    onSignUp: z.infer<typeof OnSignUpSchema>
  ): Promise<{ id: string }>;
}
