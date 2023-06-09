import { prisma } from "@/db/prisma";
import { ValidateParams } from "utils";
import { z } from "zod";

const AddUserSchema = z.object({
  username: z.string(),
  credential: z.object({
    id: z.string(),
    publicKey: z.string(),
    algorithm: z.enum(["RS256", "ES256"]),
  }),
  authenticatorData: z.string(),
  clientData: z.string(),
  domain: z.string(),
});

export interface DatabaseServiceInterface {
  addUser: (user: z.infer<typeof AddUserSchema>) => Promise<{ id: number }>;
}

export class DatabaseService implements DatabaseServiceInterface {
  @ValidateParams(AddUserSchema)
  async addUser(user: z.infer<typeof AddUserSchema>) {
    try {
      const createdUser = await prisma.user.create({
        data: {
          username: user.username,
          domain: {
            connect: {
              name: user.domain,
            },
          },
          Credential: {
            create: {
              id: user.credential.id,
              publicKey: user.credential.publicKey,
              algorithm: user.credential.algorithm,
            },
          },
        },
      });

      return {
        id: createdUser.id,
      };
    } catch (e: any) {
      if (e.code === "P2025") {
        throw new Error("Domain does not exist");
      }
      throw e;
    }
  }
}
