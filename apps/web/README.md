# Akashic DevKit - Web

This is the documentation website and component registry for Akashic DevKit. It serves two purposes:
1.  **Documentation**: Showcases your components and hooks.
2.  **Registry**: Serves the raw code of your components/hooks to the CLI.

## Project Structure

```
src/
├── components/       # Your UI components
├── hooks/            # Your custom hooks
├── registry/         # Registry definition (auto-generated or manually maintained)
└── ...
```

## Scripts

### Create New Component
Generates a new component template in `src/components`.
```bash
pnpm create:component <component-name>
```

### Create New Hook
Generates a new hook template in `src/hooks`.
```bash
pnpm create:hook <hook-name>
```

### Clean Component
Removes a component and its related files.
```bash
pnpm clean:component <component-name>
```

### Clean Hook
Removes a hook and its related files.
```bash
pnpm clean:hook <hook-name>
```

## Environment Variables

You can configure the CLI command name displayed in the installation tabs by setting the `VITE_CLI_NAME` environment variable.

1.  Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
2.  Edit `.env`:
    ```env
    VITE_CLI_NAME=your-cli-name
    ```
    (Default is `akashic`)
