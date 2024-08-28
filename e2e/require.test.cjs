// Tests whether this module can be loaded from a CJS-format file.
// To run this test, you must first build the package. Run `npm run build`.
// We use the Node.js test runner to prevent `import` and `require` from being transformed.

const { equal } = require("node:assert/strict");
const { test } = require("node:test");

test("can require js", () => {
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
});
