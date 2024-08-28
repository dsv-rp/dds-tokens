/** Type definition of `themes/$themes.json` */
export interface Theme {
  readonly id: string;
  readonly group: string;
  readonly name: string;
  readonly selectedTokenSets: Readonly<Record<string, "enabled" | "disabled">>;
}

/** Record<tokenName, tokenValue> */
export type Tokenset = Record<string, string>;

/** Record<themeName, Tokenset> */
export type ThemeTokensetMap = Record<string, Tokenset>;
