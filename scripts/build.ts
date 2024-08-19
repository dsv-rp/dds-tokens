import { register } from "@tokens-studio/sd-transforms";
import fsp from "node:fs/promises";
import StyleDictionary, { type Config } from "style-dictionary";
import { GROUP_NAME_MAP, THEME_NAME_MAP } from "./lib/config";
import type { Theme } from "./lib/types";

// Required to use `@tokens-studio/sd-transforms`
await register(StyleDictionary);

// Load theme index
const $themes = JSON.parse(
  await fsp.readFile("themes/$themes.json", "utf-8")
) as readonly Theme[];

// Cleanup build dir
await fsp.rm("build", { force: true, recursive: true });

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
    .map(([tokenset]) => `themes/${tokenset}.json`);

  const config: Config = {
    source,
    preprocessors: ["tokens-studio"],
    platforms: {
      js: {
        transformGroup: "tokens-studio",
        buildPath: `build/js/${baseDir}/`,
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
        ],
      },
      css: {
        transformGroup: "tokens-studio",
        buildPath: `build/css/${baseDir}/`,
        prefix: "dds",
        transforms: ["name/kebab"],
        files: [
          // Includes all tokens
          // For general use (users use most components), storybook
          {
            destination: "variables.css",
            format: "css/variables",
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
    },
  };

  const sd = new StyleDictionary(config);
  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();

  // Build SCSS mixins
  // Style Dictionary doesn't have a SCSS mixin format.
  const css = await fsp.readFile(`build/css/${baseDir}/variables.css`, "utf-8");
  await fsp.mkdir(`build/scss/${baseDir}`, {
    recursive: true,
  });

  // The underscore in the filename prefix indicates that the SCSS file is a [partial](https://sass-lang.com/guide/#partials).
  // This underscore should be omitted when they are `@use`-ed or `@forward`-ed by other SCSS files.
  await fsp.writeFile(
    `build/scss/${baseDir}/_mixins.scss`,
    css.replace(":root", "@mixin variables")
  );

  scssMixins.push([`${baseDir}/mixins`, `${groupName}-${themeName}`]);
}

// Build SCSS root
await fsp.writeFile(
  "build/scss/_mixins.scss",
  scssMixins
    .map(
      ([importPath, prefix]) =>
        `@forward ${JSON.stringify(importPath)} as ${prefix}-*;\n`
    )
    .join("")
);
