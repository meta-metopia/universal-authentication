import { prisma } from "@/db/prisma";
import { ValidateParams } from "@/decorators/zodparam.decorator";
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
  }
}
