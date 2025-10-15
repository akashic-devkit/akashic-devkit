import degit from "degit";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import { dirname, resolve } from "path";

/**
 * Fetch component or hook from registry
 */
export async function fetchFromRegistry(
  registry: string,
  itemName: string,
  targetPath: string
): Promise<void> {
  if (!registry) {
    throw new Error("Registry URL is not configured in akashic.json");
  }

  // degit을 사용하여 파일 가져오기
  const emitter = degit(`${registry}/${itemName}`, {
    cache: false,
    force: true,
  });

  // 대상 디렉토리가 없으면 생성
  const targetDir = dirname(targetPath);
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }

  try {
    await emitter.clone(targetPath);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch "${itemName}": ${error.message}`);
    }
    throw error;
  }
}

/**
 * Check if file exists
 */
export function fileExists(path: string): boolean {
  return existsSync(resolve(path));
}
