# @akashic-devkit/cli

The CLI tool for Akashic DevKit. It allows users to easily add components and hooks from your registry to their projects.

## Installation

```bash
# Using pnpm
pnpm dlx @akashic-devkit/cli

# Using npx
npx @akashic-devkit/cli

# Global install
pnpm add -g @akashic-devkit/cli
```

> **Note**: The command name (`akashic`) depends on how you configure the `bin` field in `package.json`.

## Usage

### Initialize
Initialize the configuration file (`akashic.json`) in your project.
```bash
akashic init
```

### Add Component/Hook
Add a component or hook to your project.
```bash
akashic add <name>
```
Example:
```bash
akashic add button
akashic add use-toast
```

### List Available Items
List all available components and hooks in the registry.
```bash
akashic list
# or
akashic ls
```

### Show Info
Display CLI information.
```bash
akashic info
```

## Configuration (`akashic.json`)

```json
{
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks"
  },
}
```
- **aliases**: Where to place installed components/hooks.
