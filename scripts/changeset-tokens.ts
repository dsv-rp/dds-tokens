import fsp from "node:fs/promises";
import {
  compareThemeTokensets,
  formatCompareResult,
  getSemverBumpType,
} from "./lib/compare";
import {
  CURRENT_PROJECT_DIR,
  PREVIOUS_PROJECT_DIR,
  THEMES_DIR,
  TOKENS_CHANGESET_FILENAME,
} from "./lib/config";
import { loadThemeTokensetMap } from "./lib/loader";
import { loadPackageJSON } from "./lib/package-json";
import { semverBumpTypeToDigit } from "./lib/semver";

// Remove changeset file if exists.
await fsp.rm(TOKENS_CHANGESET_FILENAME, { force: true });

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

${formatCompareResult(compareResult)}
`.trim() + "\n";
await fsp.writeFile(TOKENS_CHANGESET_FILENAME, content);

console.log("Created changeset file.");
