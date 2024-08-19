import { loadThemeTokensetMap } from "./loader";
import type { SemverBumpType } from "./semver";

/**
 * The result of comparing the token sets (`themes` directory) in the two repositories
 */
export interface ThemeCompareResult {
  /** Number of tokens added (total for all themes) */
  totalAdded: number;
  /** Number of tokens modified (total for all themes) */
  totalModified: number;
  /** Number of tokens removed (total for all themes) */
  totalRemoved: number;
}

/**
 * Compares the two `themes` directories and calculates the increase/decrease and changes in tokens.
 * @param currentThemesDir Current `themes` directory.
 * @param previousThemesDir Previous `themes` directory.
 * @returns The result of comparing the token sets.
 */
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

/**
 * Calculates the type of changes from the comparison results of the token set.
 * @param result The comparison results of the token set
 * @returns The type of changes
 */
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

/**
 * Converts the comparison results of the token set into a changelog in Markdown format.
 * @param result The comparison results of the token set
 * @returns A changelog in Markdown format
 */
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
