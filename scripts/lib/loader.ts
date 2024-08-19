import { register } from "@tokens-studio/sd-transforms";
import fs from "node:fs";
import fsp from "node:fs/promises";
import StyleDictionary from "style-dictionary";
import type { Theme, ThemeTokensetMap } from "./types";

await register(StyleDictionary);

export async function loadThemeTokensetMap(
  themesDir: string,
  allowMissing = false
): Promise<ThemeTokensetMap> {
  const result: ThemeTokensetMap = {};

  if (allowMissing) {
    if (!fs.existsSync(`${themesDir}/$themes.json`)) {
      return {};
    }
  }

  const $themes = JSON.parse(
    await fsp.readFile(`${themesDir}/$themes.json`, "utf-8")
  ) as readonly Theme[];

  for (const theme of $themes) {
    const themeName = `${theme.group} ${theme.name}`;

    const source = Object.entries(theme.selectedTokenSets)
      .filter(([, val]) => val !== "disabled")
      .map(([tokenset]) => `${themesDir}/${tokenset}.json`);

    const sd = new StyleDictionary({
      source,
      preprocessors: ["tokens-studio"],
      platforms: {
        data: {
          transformGroup: "tokens-studio",
          transforms: ["name/kebab"],
        },
      },
    });
    const { dictionary } = await sd.getPlatform("data");

    const tokenRecord = Object.fromEntries(
      dictionary.allTokens
        .toSorted((a, b) => a.name.localeCompare(b.name, "en-US"))
        .map(({ name, value }) => [name, value])
    );

    result[themeName] = tokenRecord;
  }

  return result;
}
