import { Agent } from "undici";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { dirname, resolve } from "path";

const GITHUB_REPO = "akashic-devkit/akashic-devkit";
const GITHUB_BRANCH = "main";
const REGISTRY_PATH = "apps/web/src/registry";

export type ItemType = "components" | "hooks";

interface RegistryItem {
  name: string;
  type: string;
}

// Skip SSL certificate verification (controlled by environment variable)
// Required only in specific environments like corporate proxies: AKASHIC_SKIP_SSL_VERIFY=1
const dispatcher =
  process.env.AKASHIC_SKIP_SSL_VERIFY === "1"
    ? new Agent({
        connect: {
          rejectUnauthorized: false,
        },
      })
    : undefined;

// Display warning when SSL verification is skipped
if (process.env.AKASHIC_SKIP_SSL_VERIFY === "1") {
  console.warn("⚠️  Warning: SSL certificate verification is disabled");
}

/**
 * Get all items from registry by type
 */
export async function getRegistryItems(type: ItemType): Promise<string[]> {
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${REGISTRY_PATH}/${type}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "akashic-devkit-cli",
      },
      dispatcher,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}: ${response.statusText}`);
    }

    const items = (await response.json()) as RegistryItem[];
    return items.filter((item) => item.type === "dir").map((item) => item.name);
  } catch (error: any) {
    // Check for SSL certificate errors (most SSL/TLS errors include 'CERT' in error code)
    if (error.cause?.code?.includes('CERT')) {
      throw new Error(`
SSL certificate verification failed: ${error.cause.message}

To skip SSL verification (not recommended), use:
  AKASHIC_SKIP_SSL_VERIFY=1 akashic ${type === "components" ? "add" : "add"} <name>

For more information, see: https://github.com/akashic-devkit/akashic-devkit#troubleshooting
      `);
    }
    throw error;
  }
}

/**
 * Check if item exists in registry using GitHub API
 */
export async function checkItemExists(name: string, type: ItemType): Promise<boolean> {
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${REGISTRY_PATH}/${type}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "akashic-devkit-cli",
      },
      dispatcher,
    });

    if (!response.ok) {
      return false;
    }

    const items = (await response.json()) as RegistryItem[];
    return items.some((item) => item.type === "dir" && item.name === name);
  } catch {
    return false;
  }
}

/**
 * Fetch file content from GitHub raw URL
 */
export async function fetchFileFromRegistry(
  name: string,
  type: ItemType,
  extension: string
): Promise<string | unknown> {
  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${REGISTRY_PATH}/${type}/${name}/${name}.${extension}`;

  try {
    const response = await fetch(rawUrl, {
      headers: {
        "User-Agent": "akashic-devkit-cli",
      },
      dispatcher,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch "${name}": ${response.statusText}`);
    }

    if (extension === "json") {
      return await response.json();
    }

    return await response.text();
  } catch (error: any) {
    // Check for SSL certificate errors (most SSL/TLS errors include 'CERT' in error code)
    if (error.cause?.code?.includes('CERT')) {
      throw new Error(`
SSL certificate verification failed: ${error.cause.message}

To skip SSL verification (not recommended), use:
  AKASHIC_SKIP_SSL_VERIFY=1 akashic add ${name}

For more information, see: https://github.com/akashic-devkit/akashic-devkit#troubleshooting
      `);
    }
    throw error;
  }
}

/**
 * Save file to target path
 */
export async function saveFile(content: string, targetPath: string): Promise<void> {
  const targetDir = dirname(targetPath);

  // Create directory if it doesn't exist
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }

  await writeFile(targetPath, content, "utf-8");
}

/**
 * Check if file exists
 */
export function fileExists(path: string): boolean {
  return existsSync(resolve(path));
}
