/** Type definition of `themes/$themes.json` */
export interface Theme {
  readonly id: string;
  readonly group: string;
  readonly name: string;
  readonly selectedTokenSets: Readonly<Record<string, "enabled" | "disabled">>;
}

export type TokenValue = string | number;

/** Record<tokenName, tokenValue> */
export type Tokenset = Record<string, [type: string, value: TokenValue]>;

/** Record<themeName, Tokenset> */
export type ThemeTokensetMap = Record<string, Tokenset>;
