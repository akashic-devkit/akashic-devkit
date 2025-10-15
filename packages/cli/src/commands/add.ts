import { Command } from "commander";
import { resolve } from "path";
import { readConfig } from "../utils/config.js";
import { confirm } from "../utils/prompts.js";
import {
  checkItemExists,
  fetchFileFromRegistry,
  fileExists,
  saveFile,
} from "../utils/registry.js";

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

        // Determine if it's a component or hook
        const isHook = name.startsWith("use");
        const itemType = isHook ? "hooks" : "components";
        const extension = isHook ? "ts" : "tsx";
        const targetAlias = config.aliases[itemType];

        // Check if item exists in registry
        console.log(`Checking if "${name}" exists...`);
        const exists = await checkItemExists(name, itemType);
        if (!exists) {
          console.error(`Error: "${name}" does not exist in the registry`);
          process.exit(1);
        }

        // Resolve target path
        // Convert @/components or @/hooks to src/components or src/hooks
        const relativePath = targetAlias.replace("@/", "src/");
        const fileName = `${name}.${extension}`;
        const targetPath = resolve(cwd, relativePath, fileName);

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

        // Fetch file content from registry
        console.log(`Fetching ${name}...`);
        const content = await fetchFileFromRegistry(name, itemType, extension);

        // Save file
        await saveFile(content, targetPath);

        console.log(`✓ Added ${name} to ${relativePath}/${fileName}`);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        }
        process.exit(1);
      }
    });
}
