import { server } from "@passwordless-id/webauthn";
import {
  AuthenticationEncoded,
  CredentialKey,
  RegistrationEncoded,
} from "@passwordless-id/webauthn/dist/esm/types";

interface RegistrationChecks {
  challenge: string | Function;
  origin: string | Function;
}

interface AuthenticationChecks {
  challenge: string | Function;
  origin: string | Function;
  userVerified: boolean;
  counter: number;
}

export class WebauthnService {
  verifyRegistration(
    registration: RegistrationEncoded,
    expect: RegistrationChecks
  ) {
    return server.verifyRegistration(registration, expect);
  }

  verifyAuthentication(
    authenticationRaw: AuthenticationEncoded,
    credential: CredentialKey,
    expected: AuthenticationChecks
  ) {
    return server.verifyAuthentication(authenticationRaw, credential, expected);
  }
}
