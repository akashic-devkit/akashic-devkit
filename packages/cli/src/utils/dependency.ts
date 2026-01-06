import { ItemType, fetchFileFromRegistry } from "./registry.js";
import { execSync } from "child_process";
import { detect } from "@antfu/ni";
import { existsSync } from "fs";
import { resolve } from "path";
import { logger } from "./logger.js";
import { checkDependencies, VersionConflict } from "./version-manager.js";

interface DependencyJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
}

export async function addDependencies(name: string, itemType: ItemType, isDryRun = false) {
  const cwd = process.cwd();

  // Check if package.json exists
  const packageJsonPath = resolve(cwd, "package.json");
  if (!existsSync(packageJsonPath)) {
    throw new Error("No package.json found in current directory. Please run 'npm init' first.");
  }

  const json = (await fetchFileFromRegistry(name, itemType, "json")) as DependencyJson;

  if (!json || !json["dependencies"] || typeof json["dependencies"] !== "object") {
    throw new Error("Failed to get dependencies");
  }

  const requiredDependencies = json.dependencies;
  const dependencyCount = Object.keys(requiredDependencies).length;

  // No dependencies to install
  if (dependencyCount === 0) {
    logger.info(`No dependencies required for ${name}`);
    return;
  }

  // Check version compatibility
  const versionCheck = checkDependencies(requiredDependencies, cwd);

  // Handle version conflicts
  if (versionCheck.conflicts.length > 0) {
    handleVersionConflicts(versionCheck.conflicts);
    return;
  }

  // Install only new packages
  if (versionCheck.newPackages.length > 0) {
    const packagesToInstall = versionCheck.newPackages.map((pkg) => `${pkg}@${requiredDependencies[pkg]}`);

    const packageManager = (await detect({ cwd })) || "npm";
    const command = getInstallCommand(packageManager, packagesToInstall);

    if (isDryRun) {
      logger.info(`Would run: ${command}`);
      logger.info(`Would install ${packagesToInstall.length} packages`, {
        packages: packagesToInstall.join(", "),
      });
      return;
    }

    try {
      execSync(command, { stdio: "inherit", cwd });

      logger.success(`Installed ${packagesToInstall.length} packages using ${packageManager}`, {
        command: command,
        packages: packagesToInstall.join(", "),
      });
    } catch (_) {
      logger.error("Failed to install dependencies");
      logger.info(`Attempted command: ${command}`);
      throw new Error("Dependency installation failed");
    }
  } else if (isDryRun) {
    logger.info(`No new packages to install`);
  }

  // Report existing compatible packages
  if (versionCheck.existingPackages.length > 0) {
    logger.info(`Using existing compatible packages`, {
      packages: versionCheck.existingPackages.join(", "),
    });
  }
}

function handleVersionConflicts(conflicts: VersionConflict[]) {
  logger.error("Version conflicts detected:");

  for (const conflict of conflicts) {
    switch (conflict.conflictType) {
      case "exact-mismatch":
        logger.error(
          `  ${conflict.package}: required ${conflict.required}, but ${conflict.installed} is installed`
        );
        logger.info(`    To fix: install ${conflict.package}@${conflict.required}`);
        break;

      case "range-violation":
        logger.error(
          `  ${conflict.package}: version ${conflict.installed} does not satisfy ${conflict.required}`
        );
        logger.info(`    To fix: install ${conflict.package}@${conflict.required}`);
        break;

      case "incompatible":
        logger.error(`  ${conflict.package}: incompatible versions`);
        break;
    }
  }

  logger.break();
  logger.info("Options:");
  logger.info("  1. Update the conflicting packages manually");
  logger.info("  2. Use --force flag to override (not recommended)");

  throw new Error("Version conflicts must be resolved before installation");
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
