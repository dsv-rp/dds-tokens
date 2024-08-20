import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // We have to exclude "e2e" directory.
    dir: "scripts",
  },
});
