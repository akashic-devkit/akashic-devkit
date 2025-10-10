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

### Check version
```bash
akashic --version
akashic -v
```

### Show CLI info
```bash
akashic info
```

### Display help
```bash
akashic --help
akashic -h
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
akashic info

# Or run directly
node dist/index.js --version
```

## Project Structure

```
packages/cli/
├── src/
│   └── index.ts           # CLI entry point
├── dist/                  # Built files (generated)
├── package.json
├── tsconfig.json          # Extends @akashic-devkit/typescript-config
├── eslint.config.js       # Extends @akashic-devkit/eslint-config
└── tsup.config.ts         # Build configuration
```
