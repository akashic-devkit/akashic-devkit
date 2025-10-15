import type { Command } from "commander";
import { infoCommand } from "./info.js";

/**
 * Register all commands to the program
 */
export function registerCommands(program: Command) {
  infoCommand(program);
}
