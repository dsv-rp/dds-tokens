import { createHash } from "node:crypto";
import fsp from "node:fs/promises";
import path from "node:path";
import {
  compareThemeTokensets,
  formatCompareResult,
  getSemverBumpType,
} from "./lib/compare";
import {
  CHANGESET_DIR,
  CURRENT_PROJECT_DIR,
  PICK_TOKEN_COUNT,
  PREVIOUS_PROJECT_DIR,
  THEMES_DIR,
  TOKENS_CHANGESET_FILENAME_PREFIX,
} from "./lib/config";
import { loadThemeTokensetMap } from "./lib/loader";
import { loadPackageJSON } from "./lib/package-json";
import { semverBumpTypeToDigit } from "./lib/semver";

// Remove previously generated changeset files, if any.
for (const filename of await fsp.readdir(CHANGESET_DIR)) {
  if (filename.startsWith(`${TOKENS_CHANGESET_FILENAME_PREFIX}-`)) {
    await fsp.rm(path.join(CHANGESET_DIR, filename), { force: true });
  }
}

// Compare tokensets.
const compareResult = compareThemeTokensets(
  await loadThemeTokensetMap(`${CURRENT_PROJECT_DIR}/${THEMES_DIR}`, false),
  await loadThemeTokensetMap(`${PREVIOUS_PROJECT_DIR}/${THEMES_DIR}`, true)
);

// Calculate bump type (breaking, feature, fix).
// Note that this does not immediately correspond to the bump digit, due to the rapid development.
const semverBumpType = getSemverBumpType(compareResult);
const hasChanges = semverBumpType != null;
if (!hasChanges) {
  console.log("No token changes found.");
  process.exit(0);
}

// Create changeset file.
const { name: packageName, version: currentVersion } = await loadPackageJSON(
  `${CURRENT_PROJECT_DIR}/package.json`,
  false
);
const bumpDigit = semverBumpTypeToDigit(semverBumpType, currentVersion);
const content =
  `
---
"${packageName}": ${bumpDigit}
---

${formatCompareResult(compareResult, PICK_TOKEN_COUNT)}
`.trim() + "\n";

// Derive the filename from the content hash so that it is deterministic
// (same content -> same filename) but changes whenever the content changes.
// This avoids Changesets treating a re-generated file as an already-consumed
// changeset when running in pre-release mode.
const hash = createHash("sha256").update(content).digest("hex").slice(0, 8);
const filename = path.join(
  CHANGESET_DIR,
  `${TOKENS_CHANGESET_FILENAME_PREFIX}-${hash}.md`
);
await fsp.writeFile(filename, content);

console.log(`Created changeset file: ${filename}`);
