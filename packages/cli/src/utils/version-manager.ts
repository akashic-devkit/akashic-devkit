import semver from "semver";
import { readFileSync } from "fs";
import { resolve } from "path";

export interface VersionConflict {
  package: string;
  required: string;
  installed: string;
  conflictType: "exact-mismatch" | "range-violation" | "incompatible";
}

export interface VersionCheckResult {
  canInstall: boolean;
  conflicts: VersionConflict[];
  newPackages: string[];
  existingPackages: string[];
}

/**
 * Check if required version satisfies installed version
 */
export function checkVersionCompatibility(required: string, installed: string): boolean {
  return semver.satisfies(installed, required);
}

/**
 * Determine version conflict type
 */
export function getConflictType(required: string, installed: string): VersionConflict["conflictType"] {
  // Exact version mismatch
  if (!semver.validRange(required) && required !== installed) {
    return "exact-mismatch";
  }

  // Range violation
  if (semver.validRange(required) && !semver.satisfies(installed, required)) {
    return "range-violation";
  }

  return "incompatible";
}

/**
 * Get installed packages from user's package.json
 */
export function getInstalledPackages(cwd: string): Record<string, string> {
  const packageJsonPath = resolve(cwd, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  return {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
}

/**
 * Check all dependencies for version compatibility
 */
export function checkDependencies(
  requiredDependencies: Record<string, string>,
  cwd: string
): VersionCheckResult {
  const installed = getInstalledPackages(cwd);
  const conflicts: VersionConflict[] = [];
  const newPackages: string[] = [];
  const existingPackages: string[] = [];

  for (const [pkg, requiredVersion] of Object.entries(requiredDependencies)) {
    const installedVersion = installed[pkg];

    if (!installedVersion) {
      // Package not installed - will install
      newPackages.push(pkg);
      continue;
    }

    // Package already exists - check compatibility
    if (checkVersionCompatibility(requiredVersion, installedVersion)) {
      // Compatible version - skip installation
      existingPackages.push(pkg);
    } else {
      // Version conflict
      conflicts.push({
        package: pkg,
        required: requiredVersion,
        installed: installedVersion,
        conflictType: getConflictType(requiredVersion, installedVersion),
      });
    }
  }

  return {
    canInstall: conflicts.length === 0,
    conflicts,
    newPackages,
    existingPackages,
  };
}
