import { loadThemeTokensetMap } from "./loader";
import type { SemverBumpType } from "./semver";

export interface ThemeCompareResult {
  totalAdded: number;
  totalModified: number;
  totalRemoved: number;
}

export async function compareThemeTokensets(
  currentThemesDir: string,
  previousThemesDir: string
): Promise<ThemeCompareResult> {
  const current = await loadThemeTokensetMap(currentThemesDir, false);
  const previous = await loadThemeTokensetMap(previousThemesDir, true);

  let totalAdded = 0;
  let totalModified = 0;
  for (const [theme, tokenset] of Object.entries(current)) {
    const previousTokenset = previous[theme] ?? {};
    for (const [tokenName, currentValue] of Object.entries(tokenset)) {
      if (previousTokenset[tokenName] == null) {
        totalAdded++;
      } else if (currentValue !== previousTokenset[tokenName]) {
        totalModified++;
      }
    }
  }

  let totalRemoved = 0;
  for (const [theme, tokenset] of Object.entries(previous)) {
    const currentTokenset = current[theme] ?? {};
    for (const tokenName of Object.keys(tokenset)) {
      if (currentTokenset[tokenName] == null) {
        totalRemoved++;
      }
    }
  }

  return {
    totalAdded,
    totalModified,
    totalRemoved,
  };
}

export function getSemverBumpType(
  result: ThemeCompareResult
): SemverBumpType | null {
  if (result.totalRemoved > 0) {
    return "breaking";
  }

  if (result.totalAdded > 0) {
    return "feature";
  }

  if (result.totalModified > 0) {
    return "fix";
  }

  return null;
}

export function formatCompareResult(result: ThemeCompareResult): string {
  let text = "";
  if (result.totalRemoved > 0) {
    text += `**BREAKING CHANGE**: ${result.totalRemoved} token(s) removed.  \n`;
  }
  if (result.totalAdded > 0) {
    text += `${result.totalAdded} token(s) added.  \n`;
  }
  if (result.totalModified > 0) {
    text += `${result.totalModified} token(s) updated.  \n`;
  }
  return text;
}
