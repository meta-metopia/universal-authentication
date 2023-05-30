import { test, expect } from "@playwright/test";

const url = process.env.url;

test("should be able to create a new challenge", async ({ request }) => {
  const response = await request.post(
    `${url}/api/auth/challenge?userId=123&type=registration`
  );
  expect(response.status()).toBe(201);
  expect(response.ok()).toBe(true);
  const data = await response.json();
  expect(data.challenge.length).toBeGreaterThan(0);
  expect(data).toHaveProperty("expiresAt");
});

test("should be able to create a new challenge and get the same challenge", async ({
  request,
}) => {
  const response = await request.post(
    `${url}/api/auth/challenge?userId=123&type=registration`
  );

  const data = await response.json();

  const response2 = await request.post(
    `${url}/api/auth/challenge?userId=123&type=registration`
  );
  const data2 = await response2.json();
  expect(data.challenge).toBe(data2.challenge);
});
