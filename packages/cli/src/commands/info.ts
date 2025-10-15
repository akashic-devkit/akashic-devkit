import { Command } from "commander";

/**
 * Info command - Display CLI information
 */
export function infoCommand(program: Command) {
  program
    .command("info")
    .description("Display CLI information")
    .action(() => {
      console.log("Akashic DevKit CLI");
      console.log("Your personal component registry");
      console.log("\nUsage: akashic <command> [options]");
    });
}
