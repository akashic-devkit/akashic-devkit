---
name: commit-convention
description: Commit message convention for akashic-devkit. Use this skill whenever you are writing a commit message, staging changes, or the user asks to commit — even if they don't say "conventional commits" explicitly. Scope is always required; use web, cli, config, or root based on which package was changed.
---

# Commit Convention

akashic-devkit enforces Conventional Commits via commitlint. A commit that fails the linter gets rejected at the commit-msg hook, so getting this right matters.

## Format

```
type(scope): subject
```

All three parts are required. The linter will reject commits missing a scope.

## Choosing the right scope

The scope tells you which part of the monorepo changed. Map it to the directory:

| scope    | changed path                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------- |
| `web`    | anything under `apps/web/`                                                                           |
| `cli`    | anything under `packages/cli/`                                                                       |
| `config` | anything under `packages/config/`                                                                    |
| `root`   | repo-level files: `turbo.json`, root `package.json`, `.husky/`, `.github/`, `.prettierrc.json`, etc. |

If a single commit touches multiple scopes, split it into separate commits. Atomic commits are easier to revert and review.

## Choosing the right type

Pick the type that best describes the _intent_ of the change, not the mechanism:

| type       | use when                                                        |
| ---------- | --------------------------------------------------------------- |
| `feat`     | adds new capability a user or developer can use                 |
| `fix`      | corrects a bug or broken behavior                               |
| `refactor` | restructures code without changing behavior                     |
| `chore`    | dependency bumps, build config, tooling changes                 |
| `docs`     | documentation only — no code change                             |
| `style`    | formatting, whitespace, semicolons (purely cosmetic)            |
| `perf`     | measurable performance improvement                              |
| `test`     | adding or modifying tests                                       |
| `ci`       | changes to CI/CD workflows or scripts                           |
| `revert`   | reverts a previous commit (reference the reverted hash in body) |

## Subject rules

- Start with a lowercase letter
- Use imperative mood: "add", "fix", "update" — not "added", "fixes", "updating"
- No period at the end
- Keep it under 72 characters

## Examples

```
feat(cli): add `akashic info` command
fix(web): resolve mobile nav overflow on small screens
chore(root): bump turbo to v2.5.6
refactor(config): extract shared eslint rules into base config
docs(web): document SwitchCase component usage
ci(root): add changeset publish step to release workflow
style(cli): apply prettier formatting to command files
```

## Quick checklist before committing

- [ ] Format is `type(scope): subject`
- [ ] Scope matches the directory that changed
- [ ] Subject is lowercase, imperative, no trailing period
- [ ] One logical change per commit
