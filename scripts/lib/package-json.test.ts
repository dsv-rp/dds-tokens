import { test } from "vitest";
import { CURRENT_PROJECT_DIR } from "./config";
import { loadPackageJSON } from "./package-json";

test("loadPackageJSON", async ({ expect }) => {
  const pkg = await loadPackageJSON(
    `${CURRENT_PROJECT_DIR}/package.json`,
    false
  );

  expect(pkg.name).toBe("@daikin-oss/dds-tokens");
  expect(typeof pkg.version).toBe("string");
});

test("loadPackageJSON (missing)", async ({ expect }) => {
  // throw if allowMissing is false.
  await expect(() =>
    loadPackageJSON(`${CURRENT_PROJECT_DIR}/not-exist/package.json`, false)
  ).rejects.toThrowError();

  // do not throw if allowMissing is false.
  expect(
    await loadPackageJSON(`${CURRENT_PROJECT_DIR}/not-exist/package.json`, true)
  ).toBe(null);
});
