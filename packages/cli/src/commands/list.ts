import { Command } from "commander";
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
        console.log("Fetching available items from registry...\n");

        // Fetch components and hooks in parallel
        const [components, hooks] = await Promise.all([
          getRegistryItems("components"),
          getRegistryItems("hooks"),
        ]);

        // Display components
        if (components.length > 0) {
          console.log("📦 Components:");
          components.forEach((component) => {
            console.log(`  - ${component}`);
          });
          console.log();
        } else {
          console.log("📦 Components: (none)\n");
        }

        // Display hooks
        if (hooks.length > 0) {
          console.log("🪝 Hooks:");
          hooks.forEach((hook) => {
            console.log(`  - ${hook}`);
          });
          console.log();
        } else {
          console.log("🪝 Hooks: (none)\n");
        }

        console.log(
          `Total: ${components.length} component(s), ${hooks.length} hook(s)`
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        }
        process.exit(1);
      }
    });
}
