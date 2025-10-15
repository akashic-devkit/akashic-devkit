import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

export interface AkashicConfig {
  aliases: {
    components: string;
    hooks: string;
  };
}

const CONFIG_FILE = "akashic.json";
const REGISTRY_BASE =
  "https://github.com/akashic-devkit/akashic-devkit/tree/main/apps/web/src/registry";

/**
 * Get default config
 */
export function getDefaultConfig(): AkashicConfig {
  return {
    aliases: {
      components: "@/components",
      hooks: "@/hooks",
    },
  };
}

/**
 * Get registry URL
 */
export function getRegistryUrl(): string {
  return REGISTRY_BASE;
}

/**
 * Check if config exists
 */
export function configExists(cwd: string = process.cwd()): boolean {
  return existsSync(resolve(cwd, CONFIG_FILE));
}

/**
 * Read config file
 */
export async function readConfig(
  cwd: string = process.cwd()
): Promise<AkashicConfig> {
  const configPath = resolve(cwd, CONFIG_FILE);

  if (!existsSync(configPath)) {
    throw new Error(
      `Configuration file not found. Please run "akashic init" first.`
    );
  }

  const content = await readFile(configPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Write config file
 */
export async function writeConfig(
  config: AkashicConfig,
  cwd: string = process.cwd()
): Promise<void> {
  const configPath = resolve(cwd, CONFIG_FILE);
  await writeFile(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
}
