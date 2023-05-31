"use client";

import Card from "@/components/Card";
import { ContainedLoadingButton } from "@/components/LoadingButtons";
import Tasks from "@/components/Tasks";
import TextField from "@/components/TextField";
import React from "react";

export default function RegisterArea() {
  return (
    <div className="space-y-10">
      <Card>
        <h1 className="text-lg">Registration form</h1>
        <div className="flex flex-row space-x-10 justify-center align-middle items-center place-content-start">
          <TextField
            label="Username"
            value={""}
            onChange={(e) => {}}
            className="flex-1 w-20 h-24"
          />

          <div className="w-40">
            <ContainedLoadingButton>Registration</ContainedLoadingButton>
          </div>
        </div>
      </Card>
      <Card>
        <Tasks />
      </Card>
    </div>
  );
}
