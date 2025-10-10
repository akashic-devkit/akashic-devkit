import { config } from "@akashic-devkit/eslint-config/base";

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...config,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
