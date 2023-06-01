"use client";

import Card from "@/components/Card";
import { ContainedLoadingButton } from "@/components/LoadingButtons";
import Picker from "@/components/Picker";
import { WebauthnClientService } from "@/services/Webauthn.service.client";
import { useCallback, useState } from "react";
import { Authentication } from "universal-authentication-sdk";

const authenticatorOptions = [
  {
    name: "auto",
    description: "Automatically choose the best authenticator to register.",
  },
  {
    name: "local",
    description:
      "Use local authenticator to register. Usually, on mobile device this means using biometric authentication",
  },
  {
    name: "roaming",
    description:
      "Use both local and external authenticator to register. Usually, on desktop this means using security key and on mobile device this means using biometric authentication",
  },
  {
    name: "both",
    description:
      "Use both local and external authenticator to register. Usually, on desktop this means using security key and on mobile device this means using biometric authentication",
  },
];

const userVerificationOptions = [
  {
    name: "required",
    description: "Require user verification for registration",
  },
  {
    name: "preferred",
    description:
      "Prefer user verification for registration, but allow alternatives",
  },
  {
    name: "discouraged",
    description: "Discourage user verification for registration",
  },
];

export default function AuthenticatorTypeArea() {
  const [loading, setLoading] = useState(false);
  const [authenticatorType, setAuthenticatorType] = useState<
    (typeof authenticatorOptions)[0]
  >(authenticatorOptions[0]);

  const [userVerification, setUserVerification] = useState<
    (typeof userVerificationOptions)[0]
  >(userVerificationOptions[0]);

  const register = useCallback(async () => {
    setLoading(true);
    await Authentication.webAuthn
      .signUp(
        {
          username: "username",
          onSendSignUp: async () => ({ id: "", error: undefined }),
          challenge: async () =>
            await WebauthnClientService.getChallenge("username"),
          authenticatorType: authenticatorType.name as any,
          userVerification: userVerification.name as any,
        },
        async ({ message, status, error }) => {}
      )
      .finally(() => {
        setLoading(false);
      });
  }, [authenticatorType]);

  return (
    <div className="space-y-10">
      <Card>
        <div className="flex flex-row space-x-10 justify-center align-middle items-center place-content-start">
          <div className="flex flex-col w-full">
            <Picker
              label="Authenticator Type"
              options={authenticatorOptions.map((o) => o.name)}
              value={authenticatorType.name}
              onChange={(v) =>
                setAuthenticatorType(
                  authenticatorOptions.find((o) => o.name === v)!
                )
              }
            />
            <p className="text-sm text-gray-500">
              {authenticatorType.description}
            </p>
            <Picker
              label="User Verification"
              options={userVerificationOptions.map((o) => o.name)}
              value={userVerification.name}
              onChange={(v) =>
                setUserVerification(
                  userVerificationOptions.find((o) => o.name === v)!
                )
              }
            />
            <p className="text-sm text-gray-500">
              {userVerification.description}
            </p>
          </div>
          <div className="mt-0 flex w-60">
            <ContainedLoadingButton
              loading={loading}
              onClick={register}
              className="w-full"
            >
              Registration
            </ContainedLoadingButton>
          </div>
        </div>
      </Card>
    </div>
  );
}
