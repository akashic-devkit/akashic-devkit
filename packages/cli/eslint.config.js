import { config } from "@akashic-devkit/eslint-config/base";

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...config,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
