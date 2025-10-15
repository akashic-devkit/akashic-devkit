import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function getVersion() {
  try {
    const packageJsonPath = join(__dirname, "../package.json");
    const packageJson = await readFile(packageJsonPath, "utf-8");
    return JSON.parse(packageJson).version;
  } catch {
    return "0.0.1";
  }
}
