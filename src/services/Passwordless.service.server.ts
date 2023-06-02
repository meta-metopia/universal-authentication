import { CatchZodError } from "@/decorators/zoderror.decorator";
import { ValidateParams } from "utils";
import { NextResponse } from "next/server";
import { KvService } from "service";
import { z } from "zod";
import {
  DatabaseService,
  DatabaseServiceInterface,
} from "./Database.service.server";
import { WebauthnService } from "./Webauthn.service.server";
import { uid } from "uid";

const PostSignupParams = z.object({
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

const GetSigninParams = z.object({
  username: z.string(),
  credential: z.string(),
  authenticatorData: z.string(),
  clientData: z.string(),
  signature: z.string(),
  domain: z.string(),
});

export class PasswordlessServerService {
  constructor(
    private readonly databaseService: DatabaseServiceInterface = new DatabaseService(),
    private readonly webauthnService: WebauthnService = new WebauthnService(),
    private readonly kvService: KvService = new KvService()
  ) {}

  @CatchZodError()
  @ValidateParams(PostSignupParams)
  async signup(registration: z.infer<typeof PostSignupParams>) {
    const key = KvService.getKey({
      type: "registration",
      userId: registration.username,
      domain: registration.domain,
    });
    if (!this.kvService.exists(key)) {
      return NextResponse.json(
        {
          error: "No registration session found",
          solution:
            "Make sure you have a valid registration session before calling this endpoint. You can try to call /api/challenge to get a valid registration session.",
        },
        { status: 400 }
      );
    }

    const storedSession = await this.kvService.get(key);
    const sessionSchema = z.object({
      challenge: z.string({ description: "The challenge string" }),
    });
    let session: z.infer<typeof sessionSchema>;

    // If a session is found, the method attempts to parse the session data
    // using the sessionSchema object defined in the code block.
    // If the parsing fails, the method deletes the session from Redis and throws the error.
    try {
      session = sessionSchema.parse(storedSession);
    } catch (e) {
      await this.kvService.del(key);
      throw e;
    }

    const registrationResult = await this.webauthnService.verifyRegistration(
      {
        username: registration.username,
        credential: registration.credential,
        authenticatorData: registration.authenticatorData,
        clientData: registration.clientData,
      },
      {
        challenge: session.challenge,
        origin: registration.domain,
      }
    );

    const createdUser = await this.databaseService.addUser({
      domain: registration.domain,
      username: registration.username,
      credential: {
        id: registrationResult.credential.id,
        publicKey: registrationResult.credential.publicKey,
        algorithm: registrationResult.credential.algorithm,
      },
      authenticatorData: registration.authenticatorData,
      clientData: registration.clientData,
    });

    return {
      id: createdUser.id,
    };
  }

  @CatchZodError()
  @ValidateParams(GetSigninParams)
  async signin(authentication: z.infer<typeof GetSigninParams>) {
    const key = KvService.getKey({
      type: "authentication",
      userId: authentication.username,
      domain: authentication.domain,
    });
    if (!this.kvService.exists(key)) {
      return NextResponse.json(
        {
          error: "No registration session found",
          solution:
            "Make sure you have a valid registration session before calling this endpoint. You can try to call /api/challenge to get a valid registration session.",
        },
        { status: 400 }
      );
    }

    const storedSession = await this.kvService.get(key);
    const sessionSchema = z.object({
      challenge: z.string({ description: "The challenge string" }),
    });
    let session: z.infer<typeof sessionSchema>;

    // If a session is found, the method attempts to parse the session data
    // using the sessionSchema object defined in the code block.
    // If the parsing fails, the method deletes the session from Redis and throws the error.
    try {
      session = sessionSchema.parse(storedSession);
    } catch (e) {
      await this.kvService.del(key);
      throw e;
    }

    const user = await this.databaseService.getUser(
      authentication.username,
      authentication.domain
    );

    await this.webauthnService.verifyAuthentication(
      {
        credentialId: authentication.credential,
        authenticatorData: authentication.authenticatorData,
        clientData: authentication.clientData,
        signature: authentication.signature,
      },
      {
        ...user.Credential!,
      },
      {
        challenge: session.challenge,
        counter: -1,
        origin: authentication.domain,
        userVerified: true,
      }
    );

    const sessionId = uid(32);
    await this.kvService.set(
      sessionId,
      JSON.stringify({
        id: user.id,
        domain: user.domain,
      })
    );

    return {
      sessionId,
    };
  }

  @CatchZodError()
  @ValidateParams([
    z.string({ description: "userId" }).nonempty(),
    z.string({ description: "domain" }).nonempty(),
  ])
  async prepareSignIn(username: string, domain: string) {
    const user = await this.databaseService.getUser(username, domain);
    if (!user.Credential) {
      return NextResponse.json(
        {
          error: "No credential found",
          solution:
            "Make sure you have a valid credential before calling this endpoint. You can try to call /api/signup to get a valid credential.",
        },
        { status: 400 }
      );
    }

    return {
      id: user.Credential!.id,
    };
  }
}
