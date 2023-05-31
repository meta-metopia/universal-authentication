"use client";

import Card from "@/components/Card";
import { ContainedLoadingButton } from "@/components/LoadingButtons";
import Tabs from "@/components/Tabs";
import Tasks from "@/components/Tasks";
import TextField from "@/components/TextField";
import { WebauthnClientService } from "@/services/Webauthn.service.client";
import React, { useCallback, useState } from "react";
import { Authentication } from "universal-authentication-sdk";

export default function RegisterArea() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [timeline, setTimeline] = useState<
    {
      content: string;
      type: "progress" | "error";
      time: string;
      subContent?: string;
    }[]
  >([]);

  const register = useCallback(async () => {
    setLoading(true);
    await Authentication.webAuthn
      .signUp(
        {
          username: username,
          onSendSignUp: async () => ({ id: "", error: undefined }),
          challenge: async () => {
            const result = await WebauthnClientService.getChallenge(username);
            if (!result.error) {
              timeline.push({
                content: "challenge-received",
                type: "progress",
                time: new Date().toLocaleTimeString(),
                subContent: `${result.challenge} for ${username}`,
              });
              setTimeline(JSON.parse(JSON.stringify(timeline)));
            }
            return result;
          },
        },
        async ({ message, status, error }) => {
          timeline.push({
            content: message,
            type: status === "progress" ? "progress" : "error",
            time: new Date().toLocaleTimeString(),
            subContent: error,
          });
          setTimeline(JSON.parse(JSON.stringify(timeline)));
        }
      )

      .finally(() => {
        setLoading(false);
      });
  }, [username, timeline]);

  return (
    <div className="space-y-10">
      <Card>
        <h1 className="text-lg">Registration form</h1>
        <div className="flex flex-row space-x-10 justify-center align-middle items-center place-content-start">
          <TextField
            label="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="flex-1 w-20 h-24"
          />

          <div className="w-40">
            <ContainedLoadingButton loading={loading} onClick={register}>
              Registration
            </ContainedLoadingButton>
          </div>
        </div>
      </Card>
      <Tabs
        tabs={[
          {
            name: "Timeline",
            current: true,
          },
          {
            name: "Diagram",
            current: false,
          },
        ]}
      />

      <div className="bg-sky-200 p-5 rounded-xl text-sky-800">
        You can choose to use the timeline or the diagram to view the
        registration process.
      </div>
      {timeline.length > 0 && (
        <Card>
          <Tasks timeline={timeline} clearTimeline={() => setTimeline([])} />
        </Card>
      )}
    </div>
  );
}
