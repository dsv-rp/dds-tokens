import { register } from "@tokens-studio/sd-transforms";
import fs from "node:fs";
import fsp from "node:fs/promises";
import StyleDictionary from "style-dictionary";
import type { Theme, ThemeTokensetMap, TokenValue } from "./types";

await register(StyleDictionary);

/**
 * Creates `ThemeTokensetMap` from specified themes directory.
 * @param themesDir Themes directory.
 * @param allowMissing If `true`, `null` is returned if the themes are not found. If `false`, an exception is thrown in that situation.
 * @returns `Record<themeName, Record<tokenName, [tokenType, tokenValue]>>`
 */
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
    const dictionary = await sd.getPlatformTokens("data");

    const tokenRecord = Object.fromEntries(
      dictionary.allTokens
        .toSorted((a, b) => a.name.localeCompare(b.name, "en-US"))
        .map(({ name, value, type }) => [
          name,
          [type ?? "unknown", value] as [string, TokenValue],
        ])
    );

    result[themeName] = tokenRecord;
  }

  return result;
}
