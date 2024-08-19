import fsp from "node:fs/promises";
import {
  compareThemeTokensets,
  formatCompareResult,
  getSemverBumpType,
  type ThemeCompareResult,
} from "./lib/compare";
import {
  CURRENT_PROJECT_DIR,
  PREVIOUS_PROJECT_DIR,
  TOKENS_CHANGESET_FILENAME,
} from "./lib/config";
import { loadPackageJSON } from "./lib/package-json";
import { semverBumpTypeToDigit } from "./lib/semver";

// Remove changeset file if exists.
await fsp.rm(TOKENS_CHANGESET_FILENAME, { force: true });

// Compare tokensets.
const compareResult = await compareThemeTokensets(
  `${CURRENT_PROJECT_DIR}/themes`,
  `${PREVIOUS_PROJECT_DIR}/themes`
);

// Calculate bump type (breaking, feature, fix).
// Note that this does not immediately correspond to bump digit, due to rapid release.
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
