import { register } from "@tokens-studio/sd-transforms";
import fsp from "node:fs/promises";
import StyleDictionary, { type Config } from "style-dictionary";
import type { FormatFn } from "style-dictionary/types";
import {
  BUILD_DIR,
  CURRENT_PROJECT_DIR,
  GROUP_NAME_MAP,
  THEME_NAME_MAP,
  THEMES_DIR,
} from "./lib/config";
import { tailwind4CommonFormatter, tailwind4Formatter } from "./lib/tailwind4";
import type { Theme } from "./lib/types";

function jsonTokensFormatter({ dictionary }: Parameters<FormatFn>[0]): string {
  return (
    JSON.stringify(
      Object.fromEntries(
        dictionary.allTokens.map((token) => [
          token.name,
          [
            String(token.value ?? "unknown"),
            token.type ?? "unknown",
            token.$extensions?.["studio.tokens"]?.originalType ?? null,
          ],
        ])
      ),
      null,
      2
    ) + "\n"
  );
}

function createConfig(baseDir: string, source: string[]): Config {
  return {
    log: {
      verbosity: "verbose",
    },
    source,
    preprocessors: ["tokens-studio"],
    platforms: {
      js: {
        transformGroup: "tokens-studio",
        buildPath: `${BUILD_DIR}/js/${baseDir}/`,
        files: [
          {
            destination: "variables.js",
            format: "javascript/es6",
          },
          {
            destination: "variables.cjs",
            format: "javascript/module-flat",
          },
          {
            format: "typescript/es6-declarations",
            destination: "variables.d.ts",
          },
          {
            format: "typescript/es6-declarations",
            destination: "variables.d.cts",
          },
        ],
      },
      css: {
        transformGroup: "tokens-studio",
        buildPath: `${BUILD_DIR}/css/${baseDir}/`,
        prefix: "dds",
        transforms: ["name/kebab"],
        files: [
          {
            destination: "variables.css",
            format: "css/variables",
            options: {
              outputReferences: false,
            },
          },
        ],
      },
      scss: {
        transformGroup: "tokens-studio",
        buildPath: `${BUILD_DIR}/scss/${baseDir}/`,
        prefix: "dds",
        transforms: ["name/kebab"],
        files: [
          {
            destination: "_mixins.scss",
            format: "css/variables",
            options: {
              outputReferences: false,
              selector: "@mixin variables",
            },
          },
        ],
      },
      json: {
        transformGroup: "tokens-studio",
        buildPath: `${BUILD_DIR}/json/${baseDir}/`,
        transforms: ["name/kebab"],
        files: [
          {
            destination: "tokens.json",
            format: "dds/json/tokens",
          },
        ],
      },
      // Tailwind 4 theme CSS
      tailwind4: {
        transformGroup: "tokens-studio",
        buildPath: `${BUILD_DIR}/css/${baseDir}/`,
        transforms: ["name/kebab"],
        files: [
          {
            destination: "tailwind4.css",
            format: "dds/tailwind4",
          },
        ],
      },
    },
  };
}

/**
 * Build `build/tailwind4.css`, the theme-agnostic common Tailwind CSS v4 file.
 *
 * This isn't tied to any single theme's build: it must declare a Tailwind variable
 * for every tokens name that exists in ANY theme (e.g. density-only tokens like
 * `inputHeight` aren't part of the daikin/Light source), so it's built from a
 * virtual token set spanning the union of every tokens set referenced across
 * `$themes.json`.
 */
function createCommonConfig(source: string[]): Config {
  return {
    log: {
      verbosity: "verbose",
      // Token sets that are mutually exclusive at runtime (e.g. density/default
      // vs density/compact) are merged together here just to enumerate every
      // token name, so colliding values across them are expected.
      warnings: "disabled",
    },
    source,
    preprocessors: ["tokens-studio"],
    platforms: {
      tailwind4Common: {
        transformGroup: "tokens-studio",
        buildPath: `${BUILD_DIR}/`,
        transforms: ["name/kebab"],
        files: [
          {
            destination: "tailwind4.css",
            format: "dds/tailwind4Common",
          },
        ],
      },
    },
  };
}

// Required to use `@tokens-studio/sd-transforms`
await register(StyleDictionary);

// Register json/tokens format
StyleDictionary.registerFormat({
  name: "dds/json/tokens",
  format: jsonTokensFormatter,
});

// Register Tailwind CSS v4 formats
StyleDictionary.registerFormat({
  name: "dds/tailwind4",
  format: tailwind4Formatter,
});
StyleDictionary.registerFormat({
  name: "dds/tailwind4Common",
  format: tailwind4CommonFormatter,
});

// Load theme index
const $themes = JSON.parse(
  await fsp.readFile(
    `${CURRENT_PROJECT_DIR}/${THEMES_DIR}/$themes.json`,
    "utf-8"
  )
) as readonly Theme[];

// Cleanup build dir
await fsp.rm(BUILD_DIR, { force: true, recursive: true });

// Build
const scssMixins: [importPath: string, prefix: string][] = [];
const commonTokenSets = new Set<string>();
for (const theme of $themes) {
  const groupName = GROUP_NAME_MAP[theme.group];
  if (!groupName) {
    throw new Error(
      `No name mapping found for group ${JSON.stringify(theme.group)}`
    );
  }

  const themeName = THEME_NAME_MAP[theme.name];
  if (!themeName) {
    throw new Error(
      `No name mapping found for theme ${JSON.stringify(theme.name)}`
    );
  }

  const baseDir = `${groupName}/${themeName}`;
  const tokenSets = Object.entries(theme.selectedTokenSets)
    .filter(([, val]) => val !== "disabled")
    .map(([tokenset]) => tokenset);
  for (const tokenset of tokenSets) {
    commonTokenSets.add(tokenset);
  }
  const source = tokenSets.map(
    (tokenset) => `${CURRENT_PROJECT_DIR}/${THEMES_DIR}/${tokenset}.json`
  );

  const sd = new StyleDictionary(createConfig(baseDir, source));
  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();

  scssMixins.push([`${baseDir}/mixins`, `${groupName}-${themeName}`]);
}

// Build build/tailwind4.css from the union of every token set used by any theme,
// so it declares Tailwind variables for tokens that only exist in some themes
// (e.g. density-only tokens).
const commonSource = [...commonTokenSets].map(
  (tokenset) => `${CURRENT_PROJECT_DIR}/${THEMES_DIR}/${tokenset}.json`
);
const commonSd = new StyleDictionary(createCommonConfig(commonSource));
await commonSd.cleanAllPlatforms();
await commonSd.buildAllPlatforms();

// Write SCSS root
await fsp.writeFile(
  `${BUILD_DIR}/scss/_mixins.scss`,
  scssMixins
    .map(
      ([importPath, prefix]) =>
        `@forward ${JSON.stringify(importPath)} as ${prefix}-*;\n`
    )
    .join("")
);
