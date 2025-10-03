import { config } from "@akashic-devkit/eslint-config/react-internal";

export default [
  ...config,
  {
    files: ["**/*.{ts,tsx}"],
  },
  {
    ignores: ["dist"],
  },
];
