import type { Dictionary, FormatFn } from "style-dictionary/types";

/**
 * Mapping from token type to Tailwind CSS variable prefix
 *
 * Each tuple contains [token type, Tailwind CSS variable prefix]:
 *
 * - If a token type maps to a string, that string is the prefix to use
 * - If a token type maps to null, that type is explicitly unsupported
 */
const TAILWIND_TYPE_MAPPINGS: ReadonlyMap<string, string | null> = new Map([
  ["color", "--color-dds-"],
  ["dimension", "--spacing-dds-"],
  ["borderRadius", "--radius-dds-"],
  ["borderWidth", "--border-width-dds-"],
  ["spacing", "--spacing-dds-"],
  ["fontFamily", "--font-family-dds-"],
  ["fontFamilies", "--font-family-dds-"],
  ["fontSize", "--font-size-dds-"],
  ["fontSizes", "--font-size-dds-"],
  ["fontWeight", "--font-weight-dds-"],
  ["fontWeights", "--font-weight-dds-"],
  ["lineHeight", "--line-height-dds-"],
  ["lineHeights", "--line-height-dds-"],
  // Explicitly unsupported types
  ["typography", null],
  ["composition", null],
]);

/**
 * Map DDS token to Tailwind CSS variable name based on token type
 *
 * @param tokenName - The DDS token name (e.g., "color-blue-10")
 * @param tokenType - The token type (e.g., "color", "spacing")
 * @returns The Tailwind CSS variable name (e.g., "--color-dds-color-blue-10") or null if explicitly unsupported
 */
export function mapToTailwindName(
  tokenName: string,
  tokenType: string | undefined
): string | null {
  if (!tokenType) {
    return null;
  }

  const tailwindPrefix = TAILWIND_TYPE_MAPPINGS.get(tokenType);

  // Type not in mapping
  if (tailwindPrefix === undefined) {
    throw new Error(
      `Unhandled token type "${tokenType}" for token "${tokenName}"`
    );
  }

  // Explicitly unsupported
  if (tailwindPrefix === null) {
    return null;
  }

  // Combine Tailwind prefix with token name
  return `${tailwindPrefix}${tokenName}`;
}

/**
 * Generate Tailwind CSS v4 theme block from Style Dictionary tokens
 *
 * @param dictionary Style Dictionary dictionary containing tokens
 * @param isCommonFile If true, generates for `build/tailwind4.css` (common file).
 *                     If false, generates for theme-specific files like `build/css/daikin/Light/tailwind4.css`.
 * @returns Tailwind CSS theme block string
 */
function formatTailwind4(
  dictionary: Dictionary,
  isCommonFile: boolean
): string {
  const tailwindVars: string[] = [];

  for (const token of dictionary.allTokens) {
    const type =
      token.$extensions?.["studio.tokens"]?.originalType ?? token.type;
    const tailwindName = mapToTailwindName(token.name, type);
    if (!tailwindName) {
      // unsupported type; skip
      continue;
    }

    // Common file: No fallback values (theme-agnostic)
    // Theme-specific file: Include fallback values (theme-dependent)
    const fallback = isCommonFile ? "" : `, ${token.value}`;

    // token.name already has kebab-case transformation applied, without --dds- prefix
    tailwindVars.push(
      `  ${tailwindName}: var(--dds-${token.name}${fallback});`
    );
  }

  if (tailwindVars.length === 0) {
    return "";
  }

  // Common file: Use `@theme inline` (no fallback values, can be inline)
  // Theme-specific file: Use `@theme` (has fallback values, cannot be inline)
  return `@theme${isCommonFile ? " inline" : ""} {\n${tailwindVars.join("\n")}\n}\n`;
}

/**
 * Style Dictionary formatter for theme-specific Tailwind CSS v4 files
 *
 * Generates `@theme` blocks with fallback values for individual theme files
 * (e.g., `build/css/daikin/Light/tailwind4.css`).
 *
 * These files include theme-specific values as fallbacks, allowing them to work standalone.
 * Cannot use `@theme inline` because fallback values are not allowed in inline themes.
 *
 * Output format: `@theme { --color-dds-blue-10: var(--dds-color-blue-10, #ddf3fc); }`
 */
export const tailwind4Formatter: FormatFn = ({ dictionary }) =>
  formatTailwind4(dictionary, false);

/**
 * Style Dictionary formatter for the common Tailwind CSS v4 theme file
 *
 * Generates an `@theme inline` block for `build/tailwind4.css` (common file).
 *
 * This file references DDS CSS variables without fallback values, as it is theme-agnostic
 * and expects the actual theme CSS to be loaded separately. Uses `@theme inline` since
 * there are no fallback values.
 *
 * Output format: `@theme inline { --color-dds-blue-10: var(--dds-color-blue-10); }`
 */
export const tailwind4CommonFormatter: FormatFn = ({ dictionary }) =>
  formatTailwind4(dictionary, true);
