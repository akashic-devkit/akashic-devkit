import { Command } from "commander";
import { getVersion } from "./utils/version.js";
import { registerCommands } from "./commands/index.js";

const program = new Command();

program
  .name("akashic")
  .description("Akashic DevKit CLI - Your personal component registry")
  .version(await getVersion(), "-v, --Version", "Display version number");

registerCommands(program);

program.parse();
