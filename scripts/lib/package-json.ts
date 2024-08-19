import fs from "node:fs";
import fsp from "node:fs/promises";

export function loadPackageJSON(
  filepath: string,
  allowMissing?: false
): Promise<{ name: string; version: string }>;
export function loadPackageJSON(
  filepath: string,
  allowMissing: true
): Promise<{ name: string; version: string } | null>;

export async function loadPackageJSON(
  filepath: string,
  allowMissing = false
): Promise<{ name: string; version: string } | null> {
  if (allowMissing) {
    if (!fs.existsSync(filepath)) {
      return null;
    }
  }

  const data = JSON.parse(await fsp.readFile(filepath, "utf-8"));
  if (!data.name || !data.version) {
    throw new Error("name or version field missing");
  }

  return data;
}
