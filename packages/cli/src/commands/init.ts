import { Command } from "commander";
import { configExists, getDefaultConfig, writeConfig } from "../utils/config.js";
import { confirm } from "../utils/prompts.js";

/**
 * Init command - Initialize akashic.json config file
 */
export function initCommand(program: Command) {
  program
    .command("init")
    .description("Initialize akashic.json config file")
    .action(async () => {
      try {
        const cwd = process.cwd();

        // Check if config already exists
        if (configExists(cwd)) {
          const shouldOverwrite = await confirm(
            "akashic.json already exists. Do you want to overwrite it?"
          );

          if (!shouldOverwrite) {
            console.log("Initialization cancelled.");
            return;
          }
        }

        // Create default config
        const config = getDefaultConfig();
        await writeConfig(config, cwd);

        console.log("✓ Created akashic.json");
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        }
        process.exit(1);
      }
    });
}
