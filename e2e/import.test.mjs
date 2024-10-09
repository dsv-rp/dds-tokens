// Tests whether this module can be loaded from an ESM-format file.
// To run this test, you must first build the package. Run `npm run build`.
// We use the Node.js test runner to prevent `import` and `require` from being transformed.

import { colorBlue10 } from "@daikin-oss/dds-tokens/js/daikin/Light/variables";
import { colorBlue20 } from "@daikin-oss/dds-tokens/js/daikin/Light/variables.js";
import tokens from "@daikin-oss/dds-tokens/json/daikin/Light/tokens.json" with { type: "json" };
import { equal } from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

await test("can static import js", () => {
  equal(typeof colorBlue10, "string");
  equal(typeof colorBlue20, "string");
  equal(typeof tokens, "object");
  equal(tokens["color-blue-30"]?.[1], "color");
});

await test("can dynamic import js", async () => {
  equal(
    typeof (await import("@daikin-oss/dds-tokens/js/daikin/Light/variables"))
      .colorBlue10,
    "string"
  );
  equal(
    typeof (await import("@daikin-oss/dds-tokens/js/daikin/Light/variables.js"))
      .colorBlue20,
    "string"
  );
  equal(
    (
      await import("@daikin-oss/dds-tokens/json/daikin/Light/tokens.json", {
        with: { type: "json" },
      })
    ).default["color-blue-30"]?.[1],
    "color"
  );
});

await test("can require cjs", () => {
  const require = createRequire(import.meta.url);

  equal(
    typeof require("@daikin-oss/dds-tokens/js/daikin/Light/variables")
      .colorBlue10,
    "string"
  );
  equal(
    typeof require("@daikin-oss/dds-tokens/js/daikin/Light/variables.js")
      .colorBlue20,
    "string"
  );
  equal(
    require("@daikin-oss/dds-tokens/json/daikin/Light/tokens.json")[
      "color-blue-30"
    ]?.[1],
    "color"
  );
});
