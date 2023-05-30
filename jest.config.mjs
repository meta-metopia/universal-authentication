import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: "jest-environment-jsdom",
  setupFiles: ["./jest.setup.js"],
  collectCoverageFrom: [
    "**/*.{js,ts}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/jest.config.js",
    "!**/jest.setup.js",
    "!**/next.config.js",
    "!**/tailwind.config.js",
    "!**/postcss.config.js",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
