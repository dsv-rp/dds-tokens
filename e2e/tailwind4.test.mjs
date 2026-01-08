import { equal } from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { compile } from "tailwindcss";

// Test that the generated tailwind4.css file is valid
await test("tailwind4.css exists and has correct structure", async () => {
  const content = await readFile("./build/tailwind4.css", "utf-8");

  // Check file is not empty
  equal(content.length > 0, true, "File should not be empty");

  // Check for @theme inline blocks
  equal(
    content.includes("@theme inline {"),
    true,
    "Should contain @theme inline blocks"
  );

  // Check for color variables
  equal(content.includes("--color-"), true, "Should contain color variables");
  equal(
    content.includes("var(--dds-color-"),
    true,
    "Should reference DDS color variables"
  );

  // Check for spacing variables
  equal(
    content.includes("--spacing-"),
    true,
    "Should contain spacing variables"
  );
  equal(
    content.includes("var(--dds-space-"),
    true,
    "Should reference DDS space variables"
  );

  // Check for radius variables
  equal(content.includes("--radius-"), true, "Should contain radius variables");
  equal(
    content.includes("var(--dds-border-radius-"),
    true,
    "Should reference DDS border-radius variables"
  );

  // Check for font variables
  equal(
    content.includes("--font-size-"),
    true,
    "Should contain font-size variables"
  );
  equal(
    content.includes("--font-weight-"),
    true,
    "Should contain font-weight variables"
  );
  equal(
    content.includes("--line-height-"),
    true,
    "Should contain line-height variables"
  );
});

// Test that Tailwind CSS v4 can compile with the theme file
await test("can compile with Tailwind CSS v4 API", async () => {
  const testCss = `
@import "@daikin-oss/dds-tokens/tailwind4.css";

.test-colors {
  @apply text-dds-blue-10;
}

.test-spacing {
  @apply p-dds-200;
}
`;

  // Compile with Tailwind CSS v4 API
  const compiler = await compile(testCss, {
    loadStylesheet: async (id, base) => {
      if (id === "@daikin-oss/dds-tokens/tailwind4.css") {
        return {
          content: await readFile("./build/tailwind4.css", "utf-8"),
          base,
        };
      }
      throw new Error(`Unknown stylesheet: ${id}`);
    },
  });
  const output = compiler.build([]);

  // Verify output
  equal(
    output.includes(`.test-colors {
  color: var(--dds-color-blue-10);
}`),
    true,
    "Should compile color utilities correctly"
  );
  equal(
    output.includes(`.test-spacing {
  padding: var(--dds-space-200);
}`),
    true,
    "Should compile spacing utilities correctly"
  );
});
