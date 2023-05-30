import { server } from "@passwordless-id/webauthn";
import { RegistrationEncoded } from "@passwordless-id/webauthn/dist/esm/types";

interface RegistrationChecks {
  challenge: string | Function;
  origin: string | Function;
}

export class WebauthnService {
  verifyRegistration(
    registration: RegistrationEncoded,
    expect: RegistrationChecks
  ) {
    return server.verifyRegistration(registration, expect);
  }
}
