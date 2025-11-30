import { Command } from "commander";
import { getPackageInfo } from "./utils/get-package-info.js";

import { registerCommands } from "./commands/index.js";

const program = new Command();

const packageInfo = await getPackageInfo();
const name = packageInfo?.bin ? Object.keys(packageInfo.bin)[0] : "akashic";
const version = packageInfo?.version || "0.0.1";
const description = packageInfo?.description || "Akashic DevKit CLI";

program
  .name(name as string)
  .description(description)
  .version(version || "0.0.1", "-v, --Version", "Display version number");

registerCommands(program, name as string);

program.parse();
