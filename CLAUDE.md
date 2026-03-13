# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Language Policy

**Think in English. Respond in Korean.**

- All internal reasoning, planning, and analysis must be done in English.
- All responses to the user must be written in Korean.
- Code, variable names, comments, and file content remain in English.

## 6. Project Structure & Naming Conventions

### Directory Structure

```
akashic-devkit/                    # pnpm monorepo root
├── apps/
│   └── web/                       # Vite + React 19 documentation site
│       └── src/
│           ├── components/        # React components (layout/, theme/, ui/)
│           ├── data/              # Static data maps (menus, registry maps)
│           ├── hooks/             # Custom React hooks
│           ├── lib/               # Generic utilities
│           ├── registry/          # Component & hook registry (components/, hooks/)
│           └── routes/            # TanStack Router file-based routes
├── packages/
│   ├── cli/                       # @akashic-devkit/cli — published npm package
│   │   └── src/
│   │       ├── commands/          # CLI subcommands (add, init, list, info)
│   │       └── utils/             # Utilities (config, registry, logger, etc.)
│   └── config/
│       ├── eslint-config/         # Shared ESLint config
│       └── typescript-config/     # Shared TypeScript config
└── .github/workflows/             # CI/CD pipelines
```

### File Naming Conventions

| Pattern            | Usage                   | Examples                                           |
| ------------------ | ----------------------- | -------------------------------------------------- |
| `PascalCase.tsx`   | React components        | `CodeTabs.tsx`, `MainLayout.tsx`, `AppSidebar.tsx` |
| `camelCase` export | Functions & hook names  | `usePageLeave`, `getPackageInfo`, `versionManager` |
| `PascalCase.json`  | Registry manifest files | `SwitchCase.json`, `UseMobile.json`                |
| `UPPER_SNAKE_CASE` | Environment variables   | `AKASHIC_SKIP_SSL_VERIFY`                          |

### Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Frontend:** React 19, Vite, TanStack Router, Tailwind CSS v4, Radix UI
- **CLI:** Commander, Inquirer, ora, tsup (ESM output), binary name `akashic`
- **Shared configs:** `@akashic-devkit/eslint-config`, `@akashic-devkit/typescript-config`
- **Release:** Changesets + conventional commits (scopes: `web`, `cli`, `config`, `root`)
- **All packages:** ES Modules (`"type": "module"`), Node.js >=18

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
