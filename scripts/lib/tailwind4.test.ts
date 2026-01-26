import { describe, expect, test } from "vitest";
import { mapToTailwindName, tailwind4Formatter } from "./tailwind4";

describe("tailwind 4 utilities", () => {
  describe("mapToTailwindName", () => {
    test("maps color tokens correctly", () => {
      expect(mapToTailwindName("color-blue-10", "color")).toBe(
        "--color-dds-color-blue-10"
      );
      expect(mapToTailwindName("color-red-100", "color")).toBe(
        "--color-dds-color-red-100"
      );
      expect(mapToTailwindName("color-common-brand-default", "color")).toBe(
        "--color-dds-color-common-brand-default"
      );
    });

    test("maps spacing tokens correctly", () => {
      expect(mapToTailwindName("space-100", "spacing")).toBe(
        "--spacing-dds-space-100"
      );
      expect(mapToTailwindName("space-200", "spacing")).toBe(
        "--spacing-dds-space-200"
      );
      expect(mapToTailwindName("space-050", "spacing")).toBe(
        "--spacing-dds-space-050"
      );
    });

    test("maps borderRadius tokens correctly", () => {
      expect(mapToTailwindName("border-radius-100", "borderRadius")).toBe(
        "--radius-dds-border-radius-100"
      );
      expect(mapToTailwindName("border-radius-200", "borderRadius")).toBe(
        "--radius-dds-border-radius-200"
      );
      expect(mapToTailwindName("border-radius-050", "borderRadius")).toBe(
        "--radius-dds-border-radius-050"
      );
    });

    test("maps borderWidth tokens correctly", () => {
      expect(mapToTailwindName("border-width-100", "borderWidth")).toBe(
        "--border-width-dds-border-width-100"
      );
      expect(mapToTailwindName("border-width-025", "borderWidth")).toBe(
        "--border-width-dds-border-width-025"
      );
    });

    test("maps fontSize tokens correctly", () => {
      expect(mapToTailwindName("font-size-300", "fontSize")).toBe(
        "--font-size-dds-font-size-300"
      );
      expect(mapToTailwindName("font-size-500", "fontSize")).toBe(
        "--font-size-dds-font-size-500"
      );
    });

    test("maps fontWeight tokens correctly", () => {
      expect(mapToTailwindName("font-weight-bold", "fontWeight")).toBe(
        "--font-weight-dds-font-weight-bold"
      );
      expect(mapToTailwindName("font-weight-regular", "fontWeight")).toBe(
        "--font-weight-dds-font-weight-regular"
      );
    });

    test("maps fontFamily tokens correctly", () => {
      expect(mapToTailwindName("font-family-base", "fontFamily")).toBe(
        "--font-family-dds-font-family-base"
      );
    });

    test("maps lineHeight tokens correctly", () => {
      expect(mapToTailwindName("font-line-height-tight", "lineHeight")).toBe(
        "--line-height-dds-font-line-height-tight"
      );
      expect(mapToTailwindName("font-line-height-normal", "lineHeight")).toBe(
        "--line-height-dds-font-line-height-normal"
      );
    });

    test("returns null for explicitly unsupported token types", () => {
      expect(
        mapToTailwindName("font-regular-normal-300", "typography")
      ).toBeNull();
      expect(
        mapToTailwindName("font-bold-tight-400", "composition")
      ).toBeNull();
    });

    test("returns null for undefined token types", () => {
      expect(mapToTailwindName("custom-variable", undefined)).toBeNull();
    });

    test("throws error for unmapped token types", () => {
      expect(() => mapToTailwindName("some-token", "unknownType")).toThrow(
        'Unhandled token type "unknownType" for token "some-token"'
      );
    });
  });

  describe("tailwind4Formatter", () => {
    test("generates Tailwind theme with color and spacing tokens", () => {
      const mockDictionary = {
        allTokens: [
          { name: "color-blue-10", type: "color", value: "#ddf3fc" },
          { name: "space-100", type: "spacing", value: "4px" },
          { name: "border-radius-100", type: "borderRadius", value: "4px" },
        ],
      };

      const result = tailwind4Formatter({ dictionary: mockDictionary } as any);
      expect(result).toBe(
        `@theme {
  --color-dds-color-blue-10: var(--dds-color-blue-10, #ddf3fc);
  --spacing-dds-space-100: var(--dds-space-100, 4px);
  --radius-dds-border-radius-100: var(--dds-border-radius-100, 4px);
}
`
      );
    });

    test("filters out unsupported token types", () => {
      const mockDictionary = {
        allTokens: [
          { name: "color-blue-10", type: "color", value: "#ddf3fc" },
          { name: "font-regular-normal-300", type: "typography", value: "..." },
          { name: "space-100", type: "spacing", value: "4px" },
        ],
      };

      const result = tailwind4Formatter({ dictionary: mockDictionary } as any);
      expect(result).toBe(
        `@theme {
  --color-dds-color-blue-10: var(--dds-color-blue-10, #ddf3fc);
  --spacing-dds-space-100: var(--dds-space-100, 4px);
}
`
      );
    });

    test("returns empty string when no mappable tokens", () => {
      const mockDictionary = {
        allTokens: [{ name: "divider", type: "composition", value: "#cecece" }],
      };

      const result = tailwind4Formatter({ dictionary: mockDictionary } as any);
      expect(result).toBe("");
    });

    test("handles tokens without type", () => {
      const mockDictionary = {
        allTokens: [
          { name: "color-blue-10", type: "color", value: "#ddf3fc" },
          { name: "some-token", type: undefined, value: "value" },
        ],
      };

      const result = tailwind4Formatter({ dictionary: mockDictionary } as any);
      expect(result).toBe(
        `@theme {
  --color-dds-color-blue-10: var(--dds-color-blue-10, #ddf3fc);
}
`
      );
    });
  });
});
