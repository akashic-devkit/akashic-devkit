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
export function addCommand(program: Command, cliName: string) {
  program
    .command("add <n>")
    .description("Add a component or hook")
    .option("--dry-run", "Show what would be installed without actually installing")
    .option("--without-deps", "Add component/hook files without installing dependencies")
    .action(async (name: string, options, command) => {
      try {
        // Validate arguments count
        const args = command.args;
        if (args.length !== 1) {
          logger.error("Expected exactly 1 argument");
          logger.info(`Usage: ${cliName} add <component-or-hook-name>`);
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

        let targetPath: string | undefined;
        let content: string | undefined;

        // For without-deps mode, we still need file paths and content
        if (!options.withoutDeps) {
          // Resolve target path
          // Convert @/components or @/hooks to src/components or src/hooks
          const relativePath = targetAlias.replace("@/", "src/");
          const fileName = `${name}.${extension}`;
          targetPath = resolve(cwd, relativePath, fileName);

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
          content = (await fetchFileFromRegistry(name, itemType, extension)) as string;
          fetchSpinner.stop();
        }

        // Install dependencies (unless --without-deps is specified)
        if (!options.withoutDeps) {
          const installDependencySpinner = logger.spinner(`Installing ${name} dependencies...`);
          installDependencySpinner.start();
          await addDependencies(name, itemType, options.dryRun);
          installDependencySpinner.stop();
        } else {
          logger.info("Skipping dependency installation (--without-deps flag)");
        }

        // Save file (unless dry-run)
        if (!options.dryRun) {
          await saveFile(content!, targetPath!);

          logger.success(`Added ${name}`, {
            path: `${config.aliases[itemType].replace("@/", "src/")}/${name}.${extension}`,
            type: isHook ? "hook" : "component",
          });
        } else {
          logger.info(`Dry run mode - no files were created or modified`);
        }
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error.message);
        }
        process.exit(1);
      }
    });
}
