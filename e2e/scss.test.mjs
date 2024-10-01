import { equal } from "node:assert/strict";
import { test } from "node:test";
import { compileAsync } from "sass-embedded";

await test("can compile scss (full import)", async () => {
  const result = await compileAsync("./e2e/scss-test-all.scss");
  equal(typeof result.css, "string");
  equal(result.css.includes(":root"), true);
  equal(result.css.includes(":root[data-theme"), true);
  equal(result.css.includes("prefers-color-scheme"), true);
  equal(result.css.includes("--dds-color-blue-10"), true);
});

await test("can compile scss (individual import)", async () => {
  const result = await compileAsync("./e2e/scss-test-individual.scss");
  equal(typeof result.css, "string");
  equal(result.css.includes(":root"), true);
  equal(result.css.includes(":root.dark"), true);
  equal(result.css.includes("--dds-color-blue-10"), true);
});

await test("error on invalid variables", async () => {
  const result = await compileAsync("./e2e/scss-test-error.scss").then(
    () => Promise.reject(new Error("Succeeded")),
    (err) => err
  );

  equal(String(result).includes("Undefined mixin"), true);
});
