import type { SemverBumpType } from "./semver";
import type { ThemeTokensetMap } from "./types";

/**
 * The comparison result of the tokensets (loaded from `themes` directory)
 */
export interface ThemeCompareResult {
  /** Number of tokens added (total for all themes) */
  totalAdded: number;
  /** Number of tokens removed (total for all themes) */
  totalRemoved: number;
  /** Number of tokens type modified (total for all themes) */
  totalModified: number;
  totalModifiedType: number;
  totalModifiedValue: number;
  tokenNamesRemoved: string[];
  tokenNamesTypeChanged: string[];
}

/**
 * Compares the two tokensets and calculates the increase/decrease and changes in tokens.
 * @param current Current tokensets
 * @param previous Previous tokensets
 * @returns The comparison result of the tokensets
 */
export function compareThemeTokensets(
  current: ThemeTokensetMap,
  previous: ThemeTokensetMap
): ThemeCompareResult {
  const tokenNameSetRemoved = new Set<string>();
  const tokenNameSetTypeChanged = new Set<string>();

  let totalAdded = 0;
  let totalModifiedValue = 0;
  let totalModifiedType = 0;
  for (const [theme, tokenset] of Object.entries(current)) {
    const previousTokenset = previous[theme] ?? {};
    for (const [tokenName, [currentType, currentValue]] of Object.entries(
      tokenset
    )) {
      if (previousTokenset[tokenName] == null) {
        totalAdded++;
      } else if (currentType !== previousTokenset[tokenName][0]) {
        totalModifiedType++;
        tokenNameSetTypeChanged.add(tokenName);
      } else if (currentValue !== previousTokenset[tokenName][1]) {
        totalModifiedValue++;
      }
    }
  }

  let totalRemoved = 0;
  for (const [theme, tokenset] of Object.entries(previous)) {
    const currentTokenset = current[theme] ?? {};
    for (const tokenName of Object.keys(tokenset)) {
      if (currentTokenset[tokenName] == null) {
        totalRemoved++;
        tokenNameSetRemoved.add(tokenName);
      }
    }
  }

  return {
    totalAdded,
    totalRemoved,
    totalModified: totalModifiedType + totalModifiedValue,
    totalModifiedType,
    totalModifiedValue,
    tokenNamesRemoved: Array.from(tokenNameSetRemoved).sort(),
    tokenNamesTypeChanged: Array.from(tokenNameSetTypeChanged).sort(),
  };
}

/**
 * Calculates the type of changes from the comparison results of the tokenset.
 * @param result The comparison result of the tokensets
 * @returns The type of changes. `null` if no changes found.
 */
export function getSemverBumpType(
  result: Omit<
    ThemeCompareResult,
    "tokenNamesRemoved" | "tokenNamesTypeChanged"
  >
): SemverBumpType | null {
  if (result.totalRemoved > 0 || result.totalModifiedType > 0) {
    return "breaking";
  }

  if (result.totalAdded > 0) {
    return "feature";
  }

  if (result.totalModifiedValue > 0) {
    return "fix";
  }

  return null;
}

/**
 * Converts the comparison results of the tokenset into a changelog in Markdown format.
 * @param result The comparison result of the tokensets
 * @returns A changelog in Markdown format
 */
export function formatCompareResult(result: ThemeCompareResult): string {
  let text = "";

  if (result.totalRemoved > 0) {
    text += `**BREAKING CHANGE**: ${result.totalRemoved} token(s) removed.  \n`;
  }
  if (result.totalModifiedType > 0) {
    text += `**BREAKING CHANGE**: ${result.totalModifiedType} token(s) updated with incompatible changes.  \n`;
  }
  if (result.totalAdded > 0) {
    text += `${result.totalAdded} token(s) added.  \n`;
  }
  if (result.totalModifiedValue > 0) {
    text += `${result.totalModifiedValue} token(s) updated.  \n`;
  }
  return text;
}
