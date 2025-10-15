import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { dirname, resolve } from "path";

const GITHUB_REPO = "akashic-devkit/akashic-devkit";
const GITHUB_BRANCH = "main";
const REGISTRY_PATH = "apps/web/src/registry";

type ItemType = "components" | "hooks";

interface RegistryItem {
  name: string;
  type: string;
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
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}: ${response.statusText}`);
    }

    const items = (await response.json()) as RegistryItem[];
    return items.filter((item) => item.type === "dir").map((item) => item.name);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ${type} list: ${error.message}`);
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
    const response = await fetch(apiUrl);
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
): Promise<string> {
  const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${REGISTRY_PATH}/${type}/${name}/${name}.${extension}`;

  const response = await fetch(rawUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch "${name}": ${response.statusText}`);
  }

  return await response.text();
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
