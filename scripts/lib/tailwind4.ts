/**
 * Mapping from DDS token prefixes to Tailwind CSS variable prefixes
 * Each tuple contains [DDS prefix (without --dds-), Tailwind prefix or null]
 * - string value: maps to the specified Tailwind prefix
 * - null value: explicitly not supported in Tailwind (will be filtered out)
 */
const TAILWIND_VARIABLE_MAPPINGS: ReadonlyArray<
  readonly [string, string | null]
> = [
  ["--dds-color-", "--color-dds-"],
  ["--dds-space-", "--spacing-dds-"],
  ["--dds-border-radius-", "--radius-dds-"],
  ["--dds-border-width-", "--border-width-dds-"],
  ["--dds-font-size-", "--font-size-dds-"],
  ["--dds-font-weight-", "--font-weight-dds-"],
  ["--dds-font-family-", "--font-family-dds-"],
  ["--dds-font-line-height-", "--line-height-dds-"],
  // Explicitly unsupported prefixes (composite font tokens, etc.)
  ["--dds-font-regular-", null],
  ["--dds-font-bold-", null],
  // Catch remaining font- tokens (should come after more specific ones)
  ["--dds-font-", null],
  ["--dds-divider", null],
  ["--dds-link-", null],
] as const;

/**
 * Map DDS CSS variable name to Tailwind CSS variable name
 * @param tokenName - The DDS CSS variable name (e.g., "--dds-color-blue-10")
 * @returns The Tailwind CSS variable name (e.g., "--color-blue-10") or null if explicitly unsupported
 * @throws Error if the token prefix is not defined in TAILWIND_VARIABLE_MAPPINGS
 */
export function mapToTailwindName(tokenName: string): string | null {
  // Find matching mapping
  for (const [ddsPrefix, tailwindPrefix] of TAILWIND_VARIABLE_MAPPINGS) {
    if (tokenName.startsWith(ddsPrefix)) {
      if (tailwindPrefix === null) {
        return null;
      }
      return tokenName.replace(ddsPrefix, tailwindPrefix);
    }
  }

  // No mapping found - throw error to catch undefined prefixes
  throw new Error(
    `Undefined DDS token prefix encountered: "${tokenName}". ` +
      `Please add a mapping for this prefix in TAILWIND_VARIABLE_MAPPINGS.`
  );
}

/**
 * Parse CSS content and extract DDS variable names
 * @param cssContent - The CSS file content
 * @returns Array of CSS variable names
 */
export function parseCssVariables(cssContent: string): string[] {
  const variableMatches = cssContent.matchAll(
    /^\s*(--dds-[^:]+):\s*([^;]+);/gm
  );
  const variables: string[] = [];

  for (const match of variableMatches) {
    variables.push(match[1]);
  }

  return variables;
}

/**
 * Convert DDS CSS variables to Tailwind 4 theme format
 * @param cssContent - The CSS file content with DDS variables
 * @returns Array of Tailwind CSS variable declarations
 */
export function convertToTailwindVariables(cssContent: string): string[] {
  const variableNames = parseCssVariables(cssContent);
  const tailwindVars: string[] = [];

  for (const varName of variableNames) {
    const tailwindName = mapToTailwindName(varName);
    if (tailwindName) {
      tailwindVars.push(`    ${tailwindName}: var(${varName});`);
    }
  }

  return tailwindVars;
}

/**
 * Generate Tailwind 4 theme block
 * @param variables - Array of Tailwind CSS variable declarations
 * @returns Tailwind 4 @theme inline block
 */
export function generateTailwindThemeBlock(variables: string[]): string {
  if (variables.length === 0) {
    return "";
  }
  return `@theme inline {\n${variables.join("\n")}\n}`;
}

/**
 * Generate complete Tailwind 4 theme CSS from DDS CSS content
 * @param cssContent - The CSS file content with DDS variables
 * @returns Tailwind 4 theme block
 */
export function generateTailwindTheme(cssContent: string): string {
  const variables = convertToTailwindVariables(cssContent);
  return generateTailwindThemeBlock(variables);
}
