import { ItemType, fetchFileFromRegistry } from "./registry.js";
import { execSync } from "child_process";
import { detect } from "@antfu/ni";
import { existsSync } from "fs";
import { resolve } from "path";
import { logger } from "./logger.js";

interface DependencyJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
}

export async function addDependencies(name: string, itemType: ItemType) {
  const cwd = process.cwd();

  // Check if package.json exists
  const packageJsonPath = resolve(cwd, "package.json");
  if (!existsSync(packageJsonPath)) {
    throw new Error(
      "No package.json found in current directory. Please run 'npm init' first."
    );
  }

  const json = (await fetchFileFromRegistry(name, itemType, "json")) as DependencyJson;

  if (!json || !json["dependencies"] || typeof json["dependencies"] !== "object") {
    throw new Error("Failed to get dependencies");
  }

  const dependencies = json.dependencies;
  const dependencyCount = Object.keys(dependencies).length;

  // No dependencies to install
  if (dependencyCount === 0) {
    return;
  }

  const packageManager = (await detect({ cwd })) || "npm";

  // Build package list for batch installation
  const packages = Object.entries(dependencies).map(
    ([packageName, version]) => `${packageName}@${version}`
  );

  const command = getInstallCommand(packageManager, packages);

  try {
    execSync(command, {
      stdio: "inherit",
      cwd,
    });
  } catch (error) {
    logger.error("Failed to install dependencies");
    logger.info("Possible reasons:");
    logger.info("  - Network connection issue");
    logger.info("  - Package not found in registry");
    logger.info("  - Permission denied");
    logger.break();
    logger.info(`Attempted to install: ${packages.join(", ")}`);
    throw new Error("Dependency installation failed");
  }
}

function getInstallCommand(packageManager: string, packages: string[]): string {
  const packagesStr = packages.join(" ");

  switch (packageManager) {
    case "yarn@berry":
    case "yarn":
      return `yarn add ${packagesStr}`;
    case "pnpm":
      return `pnpm add ${packagesStr}`;
    case "bun":
      return `bun add ${packagesStr}`;
    case "npm":
    default:
      return `npm install ${packagesStr}`;
  }
}
