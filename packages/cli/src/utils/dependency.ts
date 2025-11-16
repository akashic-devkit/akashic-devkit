import { ItemType, fetchFileFromRegistry } from "./registry.js";
import { execSync } from "child_process";
import { detect } from "@antfu/ni";

interface DependencyJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
}

export async function addDependencies(name: string, itemType: ItemType) {
  const json = (await fetchFileFromRegistry(name, itemType, ".json")) as DependencyJson;

  if (!json || !json["dependencies"] || typeof json["dependencies"] !== "object") {
    throw new Error("Failed to get dependencies");
  }

  const packageManager = (await detect({ cwd: process.cwd() })) || "npm";

  const commands = Object.entries(json.dependencies).map(([packageName, version]) => {
    const packageWithVersion = getInstallCommand(packageManager, packageName, version);
    return packageWithVersion;
  });

  commands.forEach((command) => {
    execSync(command, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  });
}

function getInstallCommand(packageManager: string, packageName: string, version: string): string {
  switch (packageManager) {
    case "yarn@berry":
    case "yarn":
      return `yarn add ${packageName}@${version}`;
    case "pnpm":
      return `pnpm add ${packageName}@${version}`;
    case "bun":
      return `bun add ${packageName}@${version}`;
    case "npm":
    default:
      return `npm install ${packageName}@${version}`;
  }
}
