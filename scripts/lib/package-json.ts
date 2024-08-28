import fs from "node:fs";
import fsp from "node:fs/promises";

/**
 * Reads package.json.
 * @param filepath filepath to the package.json, including the filename ("package.json").
 * @param allowMissing If `true`, `null` is returned if the file is not found. If `false`, an exception is thrown in that situation.
 * @returns The content of the package.json
 */
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
