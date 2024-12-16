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
          // Includes all tokens
          // For general use (users use most components), storybook
          {
            destination: "variables.css",
            format: "css/variables",
            options: {
              outputReferences: false,
            },
          },
          // Specific
          // For when users want to import subsets of style
          {
            destination: "buttons.css",
            format: "css/variables",
            filter: (token) => {
              return token.path.includes("button");
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
  const source = Object.entries(theme.selectedTokenSets)
    .filter(([, val]) => val !== "disabled")
    .map(
      ([tokenset]) => `${CURRENT_PROJECT_DIR}/${THEMES_DIR}/${tokenset}.json`
    );

  const sd = new StyleDictionary(createConfig(baseDir, source));
  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();

  scssMixins.push([`${baseDir}/mixins`, `${groupName}-${themeName}`]);
}

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
