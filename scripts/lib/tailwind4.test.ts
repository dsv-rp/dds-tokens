import { describe, expect, test } from "vitest";
import {
  convertToTailwindVariables,
  generateTailwindTheme,
  generateTailwindThemeBlock,
  mapToTailwindName,
  parseCssVariables,
} from "./tailwind4";

describe("tailwind 4 utilities", () => {
  describe("mapToTailwindName", () => {
    test("maps color variables correctly", () => {
      expect(mapToTailwindName("--dds-color-blue-10")).toBe(
        "--color-dds-blue-10"
      );
      expect(mapToTailwindName("--dds-color-red-100")).toBe(
        "--color-dds-red-100"
      );
      expect(mapToTailwindName("--dds-color-common-brand-default")).toBe(
        "--color-dds-common-brand-default"
      );
    });

    test("maps spacing variables correctly", () => {
      expect(mapToTailwindName("--dds-space-100")).toBe("--spacing-dds-100");
      expect(mapToTailwindName("--dds-space-200")).toBe("--spacing-dds-200");
      expect(mapToTailwindName("--dds-space-050")).toBe("--spacing-dds-050");
    });

    test("maps border-radius to radius", () => {
      expect(mapToTailwindName("--dds-border-radius-100")).toBe(
        "--radius-dds-100"
      );
      expect(mapToTailwindName("--dds-border-radius-200")).toBe(
        "--radius-dds-200"
      );
      expect(mapToTailwindName("--dds-border-radius-050")).toBe(
        "--radius-dds-050"
      );
    });

    test("maps border-width correctly", () => {
      expect(mapToTailwindName("--dds-border-width-100")).toBe(
        "--border-width-dds-100"
      );
      expect(mapToTailwindName("--dds-border-width-025")).toBe(
        "--border-width-dds-025"
      );
    });

    test("maps font-size correctly", () => {
      expect(mapToTailwindName("--dds-font-size-300")).toBe(
        "--font-size-dds-300"
      );
      expect(mapToTailwindName("--dds-font-size-500")).toBe(
        "--font-size-dds-500"
      );
    });

    test("maps font-weight correctly", () => {
      expect(mapToTailwindName("--dds-font-weight-bold")).toBe(
        "--font-weight-dds-bold"
      );
      expect(mapToTailwindName("--dds-font-weight-regular")).toBe(
        "--font-weight-dds-regular"
      );
    });

    test("maps font-family correctly", () => {
      expect(mapToTailwindName("--dds-font-family-base")).toBe(
        "--font-family-dds-base"
      );
    });

    test("maps font-line-height to line-height", () => {
      expect(mapToTailwindName("--dds-font-line-height-tight")).toBe(
        "--line-height-dds-tight"
      );
      expect(mapToTailwindName("--dds-font-line-height-normal")).toBe(
        "--line-height-dds-normal"
      );
    });

    test("returns null for explicitly unsupported variables", () => {
      expect(mapToTailwindName("--dds-font-regular-normal-300")).toBeNull();
      expect(mapToTailwindName("--dds-font-bold-tight-400")).toBeNull();
      expect(mapToTailwindName("--dds-divider")).toBeNull();
      expect(mapToTailwindName("--dds-link-text-default")).toBeNull();
    });

    test("throws error for undefined variables", () => {
      expect(() => mapToTailwindName("--custom-variable")).toThrow(
        /Undefined DDS token prefix/
      );
      expect(() => mapToTailwindName("--dds-unknown-token-123")).toThrow(
        /Undefined DDS token prefix/
      );
      expect(() => mapToTailwindName("--dds-new-prefix-value")).toThrow(
        /Undefined DDS token prefix/
      );
    });
  });

  describe("parseCssVariables", () => {
    test("extracts CSS variables from content", () => {
      const cssContent = `
:root {
  --dds-color-blue-10: #ddf3fc;
  --dds-color-blue-20: #bbe7f9;
  --dds-space-100: 4px;
  --dds-border-radius-100: 4px;
}
      `;

      const variables = parseCssVariables(cssContent);
      expect(variables).toEqual([
        "--dds-color-blue-10",
        "--dds-color-blue-20",
        "--dds-space-100",
        "--dds-border-radius-100",
      ]);
    });

    test("handles empty content", () => {
      expect(parseCssVariables("")).toEqual([]);
    });

    test("ignores non-dds variables", () => {
      const cssContent = `
:root {
  --dds-color-blue-10: #ddf3fc;
  --custom-var: 10px;
  --another: red;
}
      `;

      const variables = parseCssVariables(cssContent);
      expect(variables).toEqual(["--dds-color-blue-10"]);
    });
  });

  describe("convertToTailwindVariables", () => {
    test("converts DDS variables to Tailwind format", () => {
      const cssContent = `
:root {
  --dds-color-blue-10: #ddf3fc;
  --dds-space-100: 4px;
  --dds-border-radius-100: 4px;
}
      `;

      const tailwindVars = convertToTailwindVariables(cssContent);
      expect(tailwindVars).toEqual([
        "    --color-dds-blue-10: var(--dds-color-blue-10);",
        "    --spacing-dds-100: var(--dds-space-100);",
        "    --radius-dds-100: var(--dds-border-radius-100);",
      ]);
    });

    test("filters out un-mappable variables", () => {
      const cssContent = `
:root {
  --dds-color-blue-10: #ddf3fc;
  --dds-font-regular-normal-300: 400 12px/1.5 Roboto;
  --dds-space-100: 4px;
}
      `;

      const tailwindVars = convertToTailwindVariables(cssContent);
      expect(tailwindVars).toEqual([
        "    --color-dds-blue-10: var(--dds-color-blue-10);",
        "    --spacing-dds-100: var(--dds-space-100);",
      ]);
    });
  });

  describe("generateTailwindThemeBlock", () => {
    test("generates @theme inline block with variables", () => {
      const variables = [
        "    --color-dds-blue-10: var(--dds-color-blue-10);",
        "    --spacing-dds-100: var(--dds-space-100);",
      ];

      const result = generateTailwindThemeBlock(variables);
      expect(result).toBe(
        `@theme inline {
    --color-dds-blue-10: var(--dds-color-blue-10);
    --spacing-dds-100: var(--dds-space-100);
}`
      );
    });

    test("returns empty string for empty array", () => {
      expect(generateTailwindThemeBlock([])).toBe("");
    });
  });

  describe("generateTailwindTheme", () => {
    test("generates complete Tailwind theme from CSS content", () => {
      const cssContent = `
:root {
  --dds-color-blue-10: #ddf3fc;
  --dds-space-100: 4px;
}
      `;

      const result = generateTailwindTheme(cssContent);
      expect(result).toBe(
        `@theme inline {
    --color-dds-blue-10: var(--dds-color-blue-10);
    --spacing-dds-100: var(--dds-space-100);
}`
      );
    });

    test("returns empty string when no mappable variables", () => {
      const cssContent = `
:root {
  --dds-divider: #cecece;
}
      `;

      const result = generateTailwindTheme(cssContent);
      expect(result).toBe("");
    });
  });
});
