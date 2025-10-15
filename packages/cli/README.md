# @akashic-devkit/cli

Akashic DevKit CLI - Your personal component registry

## Installation

```bash
# Using pnpm
pnpm dlx @akashic-devkit/cli

# Using npx
npx @akashic-devkit/cli

# Global install
pnpm add -g @akashic-devkit/cli
```

## Usage

### Display help
```bash
akashic --help
akashic -h
```

### Check version
```bash
akashic --version
akashic -v
```

### Show CLI info
```bash
akashic info
```

### Initialize config
```bash
akashic init
```

Creates `akashic.json` in the current directory:
```json
{
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks"
  },
  "registry": ""
}
```

### Add component or hook
```bash
akashic add button
akashic add use-toast
```

## Development

### Install dependencies
```bash
pnpm install
```

### Build
```bash
pnpm build
```

### Development mode (watch)
```bash
pnpm dev
```

### Type check
```bash
pnpm type-check
```

### Lint
```bash
pnpm lint
```

## Testing locally

```bash
# Build the CLI
pnpm build

# Link globally
pnpm link --global

# Test the CLI
akashic --version
akashic init
akashic add button

# Or test with pack
pnpm pack
pnpm add -g ./akashic-devkit-cli-0.0.1.tgz
```

## Project Structure

```
packages/cli/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/             # Command implementations
│   │   ├── index.ts          # Command registry
│   │   ├── info.ts           # Info command
│   │   ├── init.ts           # Init command
│   │   └── add.ts            # Add command
│   └── utils/                # Utility functions
│       ├── config.ts         # Config file management
│       ├── registry.ts       # Registry operations
│       └── prompts.ts        # Interactive prompts
├── dist/                     # Built files (generated)
├── package.json
├── tsconfig.json
├── eslint.config.js
└── tsup.config.ts
```

## How it works

1. **init**: Creates `akashic.json` config file
2. **add**: Fetches component/hook from registry using degit
3. Automatically detects if it's a hook (starts with "use") or component
4. Places files in the configured alias path
5. Prompts for confirmation if file already exists
