import { Command } from "commander";
import { logger } from "../utils/logger.js";

/**
 * Info command - Display CLI information
 */
export function infoCommand(program: Command, cliName: string) {
  program
    .command("info")
    .description("Display CLI information")
    .action(() => {
      logger.break();
      logger.info("Akashic DevKit CLI");
      logger.info("Your personal component registry");
      logger.break();
      logger.info(`Usage: ${cliName} <command> [options]`);
      logger.break();
    });
}
