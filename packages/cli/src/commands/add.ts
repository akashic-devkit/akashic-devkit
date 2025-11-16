import { Command } from "commander";
import { resolve } from "path";
import { readConfig } from "../utils/config.js";
import { confirm } from "../utils/prompts.js";
import { logger } from "../utils/logger.js";
import { checkItemExists, fetchFileFromRegistry, fileExists, saveFile } from "../utils/registry.js";
import { addDependencies } from "../utils/dependency.js";

/**
 * Add command - Add a component or hook
 */
export function addCommand(program: Command) {
  program
    .command("add <n>")
    .description("Add a component or hook")
    .action(async (name: string, options, command) => {
      try {
        // Validate arguments count
        const args = command.args;
        if (args.length !== 1) {
          logger.error("Expected exactly 1 argument");
          logger.info("Usage: akashic add <component-or-hook-name>");
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
        const checkSpinner = logger.spinner(`Checking if "${name}" exists...`);
        checkSpinner.start();
        const exists = await checkItemExists(name, itemType);
        checkSpinner.stop();

        if (!exists) {
          logger.error(`"${name}" does not exist in the registry`);
          process.exit(1);
        }

        // Resolve target path
        // Convert @/components or @/hooks to src/components or src/hooks
        const relativePath = targetAlias.replace("@/", "src/");
        const fileName = `${name}.${extension}`;
        const targetPath = resolve(cwd, relativePath, fileName);

        // Check if file already exists
        if (fileExists(targetPath)) {
          const shouldOverwrite = await confirm(`"${name}" already exists. Do you want to overwrite it?`);

          if (!shouldOverwrite) {
            logger.warn("Cancelled");
            return;
          }
        }

        // Fetch file content from registry
        const fetchSpinner = logger.spinner(`Fetching ${name}...`);
        fetchSpinner.start();
        const content = (await fetchFileFromRegistry(name, itemType, extension)) as string;
        fetchSpinner.stop();

        // Install dependencies
        const installDependencySpinner = logger.spinner(`Installing ${name} dependencies...`);
        installDependencySpinner.start();
        addDependencies(name, itemType);
        installDependencySpinner.stop();

        // Save file
        await saveFile(content, targetPath);

        logger.success(`Added ${name}`, {
          path: `${relativePath}/${fileName}`,
          type: isHook ? "hook" : "component",
        });
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error.message);
        }
        process.exit(1);
      }
    });
}
