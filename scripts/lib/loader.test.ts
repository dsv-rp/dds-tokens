import { test } from "vitest";
import { CURRENT_PROJECT_DIR } from "./config";
import { loadThemeTokensetMap } from "./loader";

test("loadThemeTokensetMap", async ({ expect }) => {
  const tokensetMap = await loadThemeTokensetMap(
    `${CURRENT_PROJECT_DIR}/themes`,
    false
  );

  expect(Object.keys(tokensetMap).sort()).toMatchInlineSnapshot(`
    [
      "AAF Dark",
      "AAF Light",
      "DKN Dark",
      "DKN Light",
    ]
  `);
});

test("loadThemeTokensetMap (missing)", async ({ expect }) => {
  // throw if allowMissing is false.
  await expect(() =>
    loadThemeTokensetMap(`${CURRENT_PROJECT_DIR}/not-exist`, false)
  ).rejects.toThrowError();

  // do not throw if allowMissing is false.
  expect(
    await loadThemeTokensetMap(`${CURRENT_PROJECT_DIR}/not-exist`, true)
  ).toEqual({});
});
