import { Command } from "commander";
import { logger } from "../utils/logger.js";
import { getRegistryItems } from "../utils/registry.js";

/**
 * List command - List all available components and hooks
 */
export function listCommand(program: Command) {
  program
    .command("list")
    .alias("ls")
    .description("List all available components and hooks")
    .action(async () => {
      try {
        const spinner = logger.spinner("Fetching available items from registry...");
        spinner.start();

        // Fetch components and hooks in parallel
        const [components, hooks] = await Promise.all([
          getRegistryItems("components"),
          getRegistryItems("hooks"),
        ]);

        spinner.succeed("Registry items fetched");
        logger.break();

        // Display components
        if (components.length > 0) {
          logger.list(components, "📦 Components");
        } else {
          logger.info("📦 Components: (none)");
        }

        logger.break();

        // Display hooks
        if (hooks.length > 0) {
          logger.list(hooks, "🪝 Hooks");
        } else {
          logger.info("🪝 Hooks: (none)");
        }

        logger.info(
          `Total: ${components.length} component(s), ${hooks.length} hook(s)`
        );
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error.message);
        }
        process.exit(1);
      }
    });
}
