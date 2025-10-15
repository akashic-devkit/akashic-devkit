import { Command } from "commander";
import { resolve } from "path";
import { readConfig } from "../utils/config.js";
import { confirm } from "../utils/prompts.js";
import { fetchFromRegistry, fileExists } from "../utils/registry.js";

/**
 * Add command - Add a component or hook
 */
export function addCommand(program: Command) {
  program
    .command("add <name>")
    .description("Add a component or hook")
    .action(async (name: string, options, command) => {
      try {
        // Validate arguments count
        const args = command.args;
        if (args.length !== 1) {
          console.error("Error: Expected exactly 1 argument");
          console.log("Usage: akashic add <component-or-hook-name>");
          process.exit(1);
        }

        const cwd = process.cwd();

        // Read config
        const config = await readConfig(cwd);

        // Determine if it's a component or hook based on name
        // This is a simple heuristic - you can make it more sophisticated
        const isHook = name.startsWith("use");
        const aliasKey = isHook ? "hooks" : "components";
        const targetAlias = config.aliases[aliasKey];

        // Resolve target path
        // Note: This is simplified. You may need to handle path alias resolution
        const targetPath = resolve(cwd, targetAlias.replace("@/", "src/"), name);

        // Check if file already exists
        if (fileExists(targetPath)) {
          const shouldOverwrite = await confirm(
            `"${name}" already exists. Do you want to overwrite it?`
          );

          if (!shouldOverwrite) {
            console.log("Cancelled.");
            return;
          }
        }

        // Fetch from registry
        console.log(`Adding ${name}...`);
        await fetchFromRegistry(config.registry, name, targetPath);

        console.log(`✓ Added ${name}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        }
        process.exit(1);
      }
    });
}
