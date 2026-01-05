# Akashic DevKit

Akashic DevKit is a monorepo project designed to help you build your own component registry, similar to shadcn/ui. It includes a CLI tool and a documentation website.

## Project Structure

- **apps/web**: A documentation website and component registry built with Vite + React. This is where you add your components and hooks.
- **packages/cli**: The CLI tool that allows users to install components/hooks from your registry.
- **packages/config**: Shared configurations (ESLint, TypeScript).

## Getting Started

### 1. Fork and Clone
Fork this repository and clone it to your local

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev:all
```
This will start both the web app and the CLI in watch mode.

## Customization

### 1. Add Your Components/Hooks
Navigate to `apps/web` and use the provided scripts to add your own components or hooks.
See [apps/web/README.md](./apps/web/README.md) for more details.

### 2. Customize CLI Name
You can change the CLI command name (default: `akashic`) by modifying the `bin` field in `packages/cli/package.json`.
The CLI automatically detects the name from `package.json`.

### 3. Deploy
- **Web**: Deploy `apps/web` to Vercel or any static hosting.
- **CLI**: Publish `@akashic-devkit/cli` to npm.

## Troubleshooting

### SSL Issues

If you encounter SSL certificate verification errors when using the CLI, you can skip SSL verification:

```bash
AKASHIC_SKIP_SSL_VERIFY=1 akashic add button
```

**Warning**: This disables SSL certificate verification and should only be used in trusted environments.

## License

MIT
