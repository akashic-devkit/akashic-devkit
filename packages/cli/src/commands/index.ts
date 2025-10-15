import type { Command } from "commander";
import { addCommand } from "./add.js";
import { infoCommand } from "./info.js";
import { initCommand } from "./init.js";

/**
 * Register all commands to the program
 */
export function registerCommands(program: Command) {
  infoCommand(program);
  initCommand(program);
  addCommand(program);
}
